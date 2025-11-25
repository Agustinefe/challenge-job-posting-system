import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { JobsRepository } from './repositories/jobs.repository';
import { GetJobDto } from './dto/get-job.dto';
import { SkillsRepository } from './repositories/skills.repository';
import { TransactionManager } from '../common/utils/transaction-manager';
import { SearchJobsQueryDto } from './dto/search-jobs-query.dto';
import { GetJobsFromExternalSourceResponse } from './dto/get-jobs-from-external-source-response.dto';
import { XMLParser } from 'fast-xml-parser';
import { JobberwockyExternalSource } from './repositories/jobberwocky.external';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { StartBatchJobNotificationJobDto } from '../tasks-queue/dto/start-batch-job-notification-job.dto';
import { v4 } from 'uuid';

@Injectable()
export class JobsService {
  private readonly xmlParser = new XMLParser();
  constructor(
    private readonly jobRepository: JobsRepository,
    private readonly skillsRepository: SkillsRepository,
    private readonly jobberwockyExternalSource: JobberwockyExternalSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('job-alerts') private jobAlertsQueue: Queue,
  ) { }

  private mapExternalJobsToJobDto(
    externalJobs: GetJobsFromExternalSourceResponse,
  ): GetJobDto[] {
    const parsedJobs: GetJobDto[] = [];

    Object.entries(externalJobs).forEach(([country, jobs]) => {
      const id = v4();
      return parsedJobs.push(
        ...jobs.map((j) => {
          const { skills }: { skills: string[] } = this.xmlParser.parse(j[2]);
          return {
            id,
            name: j[0],
            salary: j[1],
            country,
            skills,
          };
        }),
      );
    });

    return parsedJobs;
  }

  async create(createUserDto: CreateJobDto): Promise<GetJobDto> {
    const existingSkills = await this.skillsRepository.findBySkill(
      createUserDto.skills,
    );

    const existingSkillNames = existingSkills.map((skill) => skill.name);

    const newSkillsNames = createUserDto.skills
      .filter((s) => !existingSkillNames.includes(s))
      .map((name) => ({ name }));

    const tx = new TransactionManager();
    return await tx.run(async () => {
      const newSkills = await this.skillsRepository.createMany(newSkillsNames);
      tx.addCompensation(
        'Remove newly created skills',
        async () => await this.skillsRepository.deleteMany(newSkills),
      );

      const newJob = await this.jobRepository.create({
        ...createUserDto,
        skills: [...existingSkills, ...newSkills],
      });

      tx.addCompensation(
        'Remove new created job',
        async () => await this.jobRepository.remove(newJob),
      );

      const job = {
        ...newJob,
        skills: newJob.skills.map((skill) => skill.name),
      };

      await this.jobAlertsQueue.add(StartBatchJobNotificationJobDto.name, {
        job,
      });

      return job;
    });
  }

  private async storeJobsInCache(jobs: GetJobDto[]) {
    await Promise.all(jobs.map((j) => this.cacheManager.set(j.id, j)));
  }

  async findAll(filters: SearchJobsQueryDto): Promise<GetJobDto[]> {
    if (
      filters?.maxSalary &&
      filters?.minSalary &&
      filters?.maxSalary < filters?.minSalary
    )
      throw new BadRequestException(
        'Max salary must be less or equal than min salary',
      );

    const fetchRepoJobs = this.jobRepository
      .findMany(filters, ['country', 'name', 'salary', 'skills'])
      .then(
        (jobs) =>
          jobs.map((job) => ({
            ...job,
            skills: job.skills.map((skill) => skill.name),
          })) as GetJobDto[],
      );

    const fetchExternalJobs = this.jobberwockyExternalSource
      .getJobs(filters)
      .then((jobs) => this.mapExternalJobsToJobDto(jobs));

    const [repoResult, externalSourceResult] = await Promise.allSettled([
      fetchRepoJobs,
      fetchExternalJobs,
    ]);

    const repoJobs = repoResult.status === 'fulfilled' ? repoResult.value : [];
    const externalJobs =
      externalSourceResult.status === 'fulfilled'
        ? externalSourceResult.value
        : [];

    if (
      repoResult.status === 'rejected' &&
      externalSourceResult.status === 'rejected'
    ) {
      throw new InternalServerErrorException(
        'Failed to fetch jobs from all sources',
      );
    }
    const jobs = repoJobs.concat(externalJobs);
    await this.storeJobsInCache(jobs);
    return jobs;
  }
}
