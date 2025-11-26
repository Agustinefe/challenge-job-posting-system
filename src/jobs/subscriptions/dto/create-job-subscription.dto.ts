import { OmitType } from '@nestjs/swagger';
import { JobSubscriptionDto } from './job-subscription.dto';

export class CreateJobSubscriptionDto extends OmitType(JobSubscriptionDto, [
  'id',
  'searchPattern',
]) {
  searchPattern?: string;
}
