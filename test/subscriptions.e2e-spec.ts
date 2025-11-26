/* eslint-disable @typescript-eslint/no-unsafe-argument */
import request from 'supertest';
import { TestHelper } from './helpers/test-app.helper';
import { Repository } from 'typeorm';
import { JobSubscription } from '../src/jobs/subscriptions/entities/job-subscription.entity';
import { JobSubscriptionDto } from '../src/jobs/subscriptions/dto/job-subscription.dto';
import { GetJobSubscriptionQueryDto } from 'src/jobs/subscriptions/dto/get-job-subscriptions-query.dto';

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
});
