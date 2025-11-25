import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class SearchJobsQueryDto {
  @ApiProperty({
    description: 'The name of the job',
    example: 'Database Administrator',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'The minimum expected salary offered for the job',
    example: 27000,
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  minSalary?: number;

  @ApiProperty({
    description: 'The maximum expected salary offered for the job',
    example: 27000,
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  maxSalary?: number;

  @ApiProperty({
    description: 'The country of the job description',
    example: 'Argentina',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country?: string;
}
