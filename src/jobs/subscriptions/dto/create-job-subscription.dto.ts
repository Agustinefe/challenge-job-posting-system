import { OmitType } from '@nestjs/swagger';
import { JobSubscriptionDto } from './job-subscription.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJobSubscriptionDto extends OmitType(JobSubscriptionDto, [
  'id',
  'searchPattern',
]) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  searchPattern?: string;
}
