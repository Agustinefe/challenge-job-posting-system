import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Job } from '../entities/job.entity';
import { HandleDBExceptions } from '../../database/decorators';
import { SearchJobsQueryDto } from '../dto/search-jobs-query.dto';
import { slugify } from '../../common/utils/slugify';

type JobData = Omit<Job, 'id' | 'slug' | 'generateSlug'>;

@Injectable()
export class JobsRepository {
  constructor(
    @InjectRepository(Job)
    private repository: Repository<Job>,
  ) { }

  @HandleDBExceptions()
  async findMany(
    filters: SearchJobsQueryDto,
    select?: (keyof Job)[],
  ): Promise<Job[]> {
    const where: any = {};

    if (filters.name) {
      where.slug = Like(slugify(filters.name));
    }

    if (filters.minSalary && filters.maxSalary) {
      where.salary = Between(filters.minSalary, filters.maxSalary);
    } else if (filters.minSalary) {
      where.salary = MoreThanOrEqual(filters.minSalary);
    } else if (filters.maxSalary) {
      where.salary = LessThanOrEqual(filters.maxSalary);
    }

    if (filters.country) {
      where.country = Like(filters.country);
    }

    return this.repository.find({
      select,
      where,
      relations: ['skills'],
    });
  }

  @HandleDBExceptions()
  async findOne(id: string, select?: (keyof Job)[]): Promise<Job | null> {
    return this.repository.findOne({
      select,
      where: { id },
      relations: ['skills'],
    });
  }

  @HandleDBExceptions()
  async create(job: JobData): Promise<Job> {
    const entity = this.repository.create(job);
    return this.repository.save(entity);
  }

  @HandleDBExceptions()
  async update(id: string, job: Partial<JobData>): Promise<Job | null> {
    await this.repository.update(id, job);
    return this.findOne(id);
  }

  @HandleDBExceptions()
  async remove(job: Job): Promise<void> {
    await this.repository.remove(job);
  }
}
