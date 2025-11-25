import { Injectable } from '@nestjs/common';
import { CreateJobSubscriptionDto } from './dto/create-job-subscription.dto';
import { JobSubscriptionsRepository } from './repositories/job-subscriptions.repository';
import { JobSubscription } from './entities/job-subscription.entity';
import { GetJobSubscriptionQueryDto } from './dto/get-job-subscriptions-query.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly jobSubscriptionsRepository: JobSubscriptionsRepository,
  ) { }

  async create(data: CreateJobSubscriptionDto): Promise<JobSubscription> {
    return await this.jobSubscriptionsRepository.create(data);
  }

  async findAll(
    query: GetJobSubscriptionQueryDto,
    pagination?: { offset: number; limit: number },
  ): Promise<JobSubscription[]> {
    return this.jobSubscriptionsRepository.findMany(
      query.searchPattern ?? null,
      pagination,
    );
  }

  async countSubscriptions(query: GetJobSubscriptionQueryDto): Promise<number> {
    return await this.jobSubscriptionsRepository.count(
      query.searchPattern ?? null,
    );
  }
}
