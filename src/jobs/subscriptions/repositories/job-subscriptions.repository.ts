import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HandleDBExceptions } from '../../../database/decorators';
import { JobSubscription } from '../entities/job-subscription.entity';
import { CreateJobSubscriptionDto } from '../dto/create-job-subscription.dto';
import { slugify } from '../../../common/utils/slugify';

@Injectable()
export class JobSubscriptionsRepository {
  constructor(
    @InjectRepository(JobSubscription)
    private repository: Repository<JobSubscription>,
  ) { }

  @HandleDBExceptions()
  async findMany(
    searchPattern: string | null,
    pagination?: { offset: number; limit: number },
  ): Promise<JobSubscription[]> {
    const query = this.repository
      .createQueryBuilder('js')
      .where('js.searchPattern is NULL');

    if (searchPattern)
      query.orWhere(`:pattern ILIKE '%' || js.searchPattern || '%'`, {
        pattern: slugify(searchPattern),
      });

    if (pagination) {
      const { offset, limit } = pagination;
      query.skip(offset).take(limit);
    }

    return await query.getMany();
  }

  @HandleDBExceptions()
  async count(searchPattern: string | null): Promise<number> {
    const query = this.repository
      .createQueryBuilder('js')
      .where('js.searchPattern is NULL');

    if (searchPattern)
      query.orWhere(`:pattern ILIKE '%' || js.searchPattern || '%'`, {
        pattern: slugify(searchPattern),
      });

    return await query.getCount();
  }

  @HandleDBExceptions()
  async create(
    jobSubscription: CreateJobSubscriptionDto,
  ): Promise<JobSubscription> {
    const entity = this.repository.create({
      ...jobSubscription,
      searchPattern: jobSubscription.searchPattern,
    });
    return this.repository.save(entity);
  }

  @HandleDBExceptions()
  async remove(jobSubscription: JobSubscription): Promise<void> {
    await this.repository.remove(jobSubscription);
  }
}
