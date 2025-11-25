import { OmitType } from '@nestjs/swagger';
import { JobSubscription } from '../entities/job-subscription.entity';

export class CreateJobSubscriptionDto extends OmitType(JobSubscription, [
  'id',
  'searchPattern',
]) {
  searchPattern?: string;
}
