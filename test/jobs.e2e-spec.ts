/* eslint-disable @typescript-eslint/no-unsafe-argument */
import request from 'supertest';
import { TestHelper } from './helpers/test-app.helper';
import { Repository } from 'typeorm';
import { Job } from '../src/jobs/entities/job.entity';
import { Skill } from '../src/jobs/entities/skills.entity';
import { JobDto } from '../src/jobs/dto/job.dto';
import { CreateJobDto } from '../src/jobs/dto/create-job.dto';
import { SearchJobsQueryDto } from '../src/jobs/dto/search-jobs-query.dto';
import { GetJobDto } from '../src/jobs/dto/get-job.dto';
import { JobberwockyExternalSource } from '../src/jobs/repositories/jobberwocky.external';
import { slugify } from '../src/common/utils/slugify';

describe('JobController (e2e)', () => {
  let context: TestHelper;
  let jobsRepository: Repository<Job>;
  let skillsRepository: Repository<Skill>;
  let jobberwockyExternalSource: JobberwockyExternalSource;
  let queueAddSpy: jest.SpyInstance;

  beforeAll(async () => {
    context = await TestHelper.initTestApp();
    jobsRepository = context.dataSource.getRepository(Job);
    skillsRepository = context.dataSource.getRepository(Skill);
    jobberwockyExternalSource = context.app.get(JobberwockyExternalSource);
    const queue = context.app.get('BullQueue_job-alerts');
    queueAddSpy = jest.spyOn(queue, 'add');
  });

  afterAll(async () => {
    await context.closeTestApp();
    queueAddSpy.mockRestore();
  });

  beforeEach(async () => {
    await context.resetTestApp();
    queueAddSpy.mockClear();
  });

  describe('GET /jobs', () => {
    it('should return an empty array when no jobs exist', async () => {
      jest
        .spyOn(jobberwockyExternalSource, 'getJobs')
        .mockReturnValue(Promise.resolve({}));
      return await request(context.app.getHttpServer())
        .get('/jobs')
        .expect(200)
        .expect([]);
    });

    it('should return all jobs', async () => {
      await context.seedTestApp();
      jest
        .spyOn(jobberwockyExternalSource, 'getJobs')
        .mockReturnValue(Promise.resolve({}));
      const response = await request(context.app.getHttpServer())
        .get('/jobs')
        .expect(200);
      const responseBody = response.body as GetJobDto[];

      expect(responseBody).toHaveLength(10);
    });

    it('should return only the jobs in Argentina', async () => {
      jest
        .spyOn(jobberwockyExternalSource, 'getJobs')
        .mockReturnValue(Promise.resolve({}));
      await context.seedTestApp();
      const query: SearchJobsQueryDto = {
        country: 'Argentina',
      };

      const response = await request(context.app.getHttpServer())
        .get('/jobs')
        .query(query)
        .expect(200);
      const responseBody = response.body as GetJobDto[];
      expect(responseBody.every((j) => j.country === 'Argentina')).toBe(true);
    });

    it('should return only the jobs related to development', async () => {
      jest
        .spyOn(jobberwockyExternalSource, 'getJobs')
        .mockReturnValue(Promise.resolve({}));
      await context.seedTestApp();
      const query: SearchJobsQueryDto = {
        name: 'Developer',
      };

      const response = await request(context.app.getHttpServer())
        .get('/jobs')
        .query(query)
        .expect(200);
      const responseBody = response.body as GetJobDto[];
      expect(responseBody.every((j) => j.name === 'Developer')).toBe(true);
    });

    it('should return only the jobs with salary above 30000', async () => {
      jest
        .spyOn(jobberwockyExternalSource, 'getJobs')
        .mockReturnValue(Promise.resolve({}));
      await context.seedTestApp();
      const query: SearchJobsQueryDto = {
        minSalary: 30000,
      };

      const response = await request(context.app.getHttpServer())
        .get('/jobs')
        .query(query)
        .expect(200);

      const responseBody = response.body as GetJobDto[];
      expect(responseBody.every((j) => j.salary >= 30000)).toBe(true);
    });

    it('should return only the jobs with salary below 60000', async () => {
      jest
        .spyOn(jobberwockyExternalSource, 'getJobs')
        .mockReturnValue(Promise.resolve({}));
      await context.seedTestApp();
      const query: SearchJobsQueryDto = {
        maxSalary: 60000,
      };

      const response = await request(context.app.getHttpServer())
        .get('/jobs')
        .query(query)
        .expect(200);

      const responseBody = response.body as GetJobDto[];
      expect(responseBody.every((j) => j.salary <= 60000)).toBe(true);
    });

    it('should throw Bad Request if minSalary is more than max salary', async () => {
      jest
        .spyOn(jobberwockyExternalSource, 'getJobs')
        .mockReturnValue(Promise.resolve({}));
      await context.seedTestApp();
      const query: SearchJobsQueryDto = {
        minSalary: 30000,
        maxSalary: 15000,
      };

      await request(context.app.getHttpServer())
        .get('/jobs')
        .query(query)
        .expect(400);
    });

    it('should merge the job external source response with the local source response', async () => {
      jest.spyOn(jobberwockyExternalSource, 'getJobs').mockReturnValue(
        Promise.resolve({
          USA: [
            [
              'Cloud Engineer',
              65000,
              '<skills><skill>AWS</skill><skill>Azure</skill><skill>Docker</skill></skills>',
            ],
            [
              'DevOps Engineer',
              60000,
              '<skills><skill>CI/CD</skill><skill>Docker</skill><skill>Kubernetes</skill></skills>',
            ],
          ],
          Spain: [
            [
              'Machine Learning Engineer',
              75000,
              '<skills><skill>Python</skill><skill>TensorFlow</skill><skill>Deep Learning</skill></skills>',
            ],
          ],
        }),
      );
      await context.seedTestApp();

      const response = await request(context.app.getHttpServer())
        .get('/jobs')
        .expect(200);

      const responseBody = response.body as GetJobDto[];
      expect(responseBody.length).toBe(13);
    });

    it('should return the external source data even if the local source fails', async () => {
      jest.spyOn(jobberwockyExternalSource, 'getJobs').mockReturnValueOnce(
        Promise.resolve({
          USA: [
            [
              'Cloud Engineer',
              65000,
              '<skills><skill>AWS</skill><skill>Azure</skill><skill>Docker</skill></skills>',
            ],
            [
              'DevOps Engineer',
              60000,
              '<skills><skill>CI/CD</skill><skill>Docker</skill><skill>Kubernetes</skill></skills>',
            ],
          ],
          Spain: [
            [
              'Machine Learning Engineer',
              75000,
              '<skills><skill>Python</skill><skill>TensorFlow</skill><skill>Deep Learning</skill></skills>',
            ],
          ],
        }),
      );

      await context.seedTestApp();
      jest
        .spyOn(jobsRepository, 'find')
        .mockRejectedValueOnce(new Error('Oops'));

      const response = await request(context.app.getHttpServer())
        .get('/jobs')
        .expect(200);

      const responseBody = response.body as GetJobDto[];
      expect(responseBody.length).toBe(3);
    });

    it('should return the local source data even if the external source fails', async () => {
      jest
        .spyOn(jobberwockyExternalSource, 'getJobs')
        .mockRejectedValueOnce(new Error('Oops'));

      await context.seedTestApp();

      const response = await request(context.app.getHttpServer())
        .get('/jobs')
        .expect(200);

      const responseBody = response.body as GetJobDto[];
      expect(responseBody.length).toBe(10);
    });

    it('should throw error if both source throw error', async () => {
      jest
        .spyOn(jobberwockyExternalSource, 'getJobs')
        .mockRejectedValueOnce(new Error('Oops'));
      jest
        .spyOn(jobsRepository, 'find')
        .mockRejectedValueOnce(new Error('Oops'));

      await request(context.app.getHttpServer()).get('/jobs').expect(500);
    });
  });

  describe('POST /jobs', () => {
    it('should create a new job without skills and store it in the DB', async () => {
      const newJob: CreateJobDto = {
        name: 'Software developer',
        country: 'USA',
        salary: 20000,
        skills: [],
      };

      const response = await request(context.app.getHttpServer())
        .post('/jobs')
        .send(newJob)
        .expect(201);

      const responseBody = response.body as JobDto;
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.name).toBe(newJob.name);
      expect(responseBody.country).toBe(newJob.country);
      expect(responseBody.salary).toBe(newJob.salary);
      expect(responseBody.skills.length).toBe(0);

      expect(
        async () =>
          await skillsRepository.exists({
            where: { id: responseBody.id },
          }),
      ).toBeTruthy();
      expect(queueAddSpy).toHaveBeenCalled();
    });

    it('should create a new job with skills and store it in the DB', async () => {
      const newJob: CreateJobDto = {
        name: 'Software developer',
        country: 'USA',
        salary: 20000,
        skills: ['Java', 'React', 'SQL'],
      };

      const response = await request(context.app.getHttpServer())
        .post('/jobs')
        .send(newJob)
        .expect(201);

      const responseBody = response.body as JobDto;
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.name).toBe(newJob.name);
      expect(responseBody.country).toBe(newJob.country);
      expect(responseBody.salary).toBe(newJob.salary);
      expect(responseBody.skills.length).toBe(3);

      const storedSkills = await skillsRepository.find({
        select: ['id', 'name', 'slug'],
      });

      expect(storedSkills.length).toBe(3);
      expect(
        storedSkills.every((ss) =>
          newJob.skills.map(slugify).includes(ss.slug),
        ),
      ).toBe(true);
      expect(queueAddSpy).toHaveBeenCalled();
    });

    it('should throw Bad Request Exception when there are missing fields', async () => {
      const saveJobSpy = jest.spyOn(jobsRepository, 'save');
      const saveSkillSpy = jest.spyOn(skillsRepository, 'save');

      const newJob = {
        name: 'Software developer',
        country: 'USA',
        skills: ['Java', 'React', 'SQL'],
      };

      await request(context.app.getHttpServer())
        .post('/jobs')
        .send(newJob)
        .expect(400);

      expect(saveJobSpy).not.toHaveBeenCalled();
      expect(saveSkillSpy).not.toHaveBeenCalled();
      expect(queueAddSpy).not.toHaveBeenCalled();
    });
  });
});
