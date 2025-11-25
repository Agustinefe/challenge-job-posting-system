import { OmitType } from '@nestjs/swagger';
import { GetJobDto } from './get-job.dto';

export class CreateJobDto extends OmitType(GetJobDto, ['id']) { }
