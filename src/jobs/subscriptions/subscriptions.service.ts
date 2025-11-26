import { Injectable } from '@nestjs/common';
import { CreateJobSubscriptionDto } from './dto/create-job-subscription.dto';
import { JobSubscriptionsRepository } from './repositories/job-subscriptions.repository';
import { GetJobSubscriptionQueryDto } from './dto/get-job-subscriptions-query.dto';
import { JobSubscriptionDto } from './dto/job-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly jobSubscriptionsRepository: JobSubscriptionsRepository,
  ) { }

  async create(data: CreateJobSubscriptionDto): Promise<JobSubscriptionDto> {
    return await this.jobSubscriptionsRepository.create(data);
  }

  async findAll(
    query: GetJobSubscriptionQueryDto,
    pagination?: { offset: number; limit: number },
  ): Promise<JobSubscriptionDto[]> {
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
