import { ApiProperty, OmitType } from '@nestjs/swagger';
import { JobDto } from './job.dto';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class GetJobDto extends OmitType(JobDto, ['skills'] as const) {
  @ApiProperty({
    description: 'The skills required for the job',
    example: ['SQL', 'NoSQL', 'Database Design'],
  })
  @Type(() => String)
  @IsArray()
  skills: string[];
}
