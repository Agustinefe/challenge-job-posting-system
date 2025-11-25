import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { SkillDto } from './skill.dto';
import { Type } from 'class-transformer';

export class JobDto {
  @ApiProperty({
    description: 'The unique identifier of the job',
    example: 1,
  })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The name of the job',
    example: 'Database Administrator',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The expected salary offered for the job',
    example: 27000,
  })
  @IsPositive()
  salary: number;

  @ApiProperty({
    description: 'The country of the job',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'The skills required for the job',
    example: ['SQL', 'NoSQL', 'Database Design'],
  })
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  @IsArray()
  skills: SkillDto[];
}
