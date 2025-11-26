/* eslint-disable @typescript-eslint/no-unsafe-argument */
import request from 'supertest';
import { TestHelper } from './helpers/test-app.helper';
import { Repository } from 'typeorm';
import { JobSubscription } from '../src/jobs/subscriptions/entities/job-subscription.entity';
import { JobSubscriptionDto } from '../src/jobs/subscriptions/dto/job-subscription.dto';
import { GetJobSubscriptionQueryDto } from 'src/jobs/subscriptions/dto/get-job-subscriptions-query.dto';
import { CreateJobSubscriptionDto } from 'src/jobs/subscriptions/dto/create-job-subscription.dto';

describe('SubscriptionController (e2e)', () => {
  let context: TestHelper;
  let jobSubscriptionssRepository: Repository<JobSubscription>;

  beforeAll(async () => {
    context = await TestHelper.initTestApp();
    jobSubscriptionssRepository =
      context.dataSource.getRepository(JobSubscription);
  });

  afterAll(async () => {
    await context.closeTestApp();
  });

  beforeEach(async () => {
    await context.resetTestApp();
  });

  describe('GET /jobs/subscriptions', () => {
    it('should return an empty array when no subscription exist', async () => {
      return await request(context.app.getHttpServer())
        .get('/jobs/subscriptions')
        .expect(200)
        .expect([]);
    });

    it('should return all subscription without searchPattern', async () => {
      await context.seedTestApp();
      const response = await request(context.app.getHttpServer())
        .get('/jobs/subscriptions')
        .expect(200);
      const responseBody = response.body as JobSubscriptionDto[];

      expect(responseBody).toHaveLength(13);
      expect(responseBody.every((js) => js.searchPattern === null)).toBe(true);
    });

    it('should return all subscription without searchPattern, or with a matching pattern', async () => {
      await context.seedTestApp();

      const query: GetJobSubscriptionQueryDto = {
        searchPattern: 'ai',
      };
      const response = await request(context.app.getHttpServer())
        .get('/jobs/subscriptions')
        .query(query)
        .expect(200);
      const responseBody = response.body as JobSubscriptionDto[];

      expect(responseBody).toHaveLength(14);
      expect(
        responseBody.every(
          (js) =>
            js.searchPattern === null ||
            js.searchPattern.includes(query.searchPattern!),
        ),
      ).toBe(true);
    });
  });
  describe('POST /jobs/subscriptions', () => {
    it('should create a subscription without search pattern', async () => {
      const createJobSubscriptionDto: CreateJobSubscriptionDto = {
        email: 'cosme@fulanito.com',
      };
      const response = await request(context.app.getHttpServer())
        .post('/jobs/subscriptions')
        .send(createJobSubscriptionDto)
        .expect(201);

      const responseBody = response.body as JobSubscriptionDto;
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.email).toBe(createJobSubscriptionDto.email);
      expect(responseBody.searchPattern).toBeNull();

      const subscriptionFromDB = await jobSubscriptionssRepository.findOne({
        where: { id: responseBody.id },
      });

      expect(subscriptionFromDB).not.toBeNull();
      expect(subscriptionFromDB!.id).toBe(responseBody.id);
      expect(subscriptionFromDB!.email).toBe(responseBody.email);
      expect(subscriptionFromDB!.searchPattern).toBeNull();
    });

    it('should create a subscription with search pattern', async () => {
      const createJobSubscriptionDto: CreateJobSubscriptionDto = {
        email: 'cosme@fulanito.com',
        searchPattern: 'pattern',
      };
      const response = await request(context.app.getHttpServer())
        .post('/jobs/subscriptions')
        .send(createJobSubscriptionDto)
        .expect(201);

      const responseBody = response.body as JobSubscriptionDto;
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.email).toBe(createJobSubscriptionDto.email);
      expect(responseBody.searchPattern).toBe(
        createJobSubscriptionDto.searchPattern,
      );

      const subscriptionFromDB = await jobSubscriptionssRepository.findOne({
        where: { id: responseBody.id },
      });

      expect(subscriptionFromDB).not.toBeNull();
      expect(subscriptionFromDB!.id).toBe(responseBody.id);
      expect(subscriptionFromDB!.email).toBe(responseBody.email);
      expect(subscriptionFromDB!.searchPattern).toBe(
        responseBody.searchPattern,
      );
    });
  });
});
