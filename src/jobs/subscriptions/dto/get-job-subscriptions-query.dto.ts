import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetJobSubscriptionQueryDto {
  @ApiProperty({
    description: 'The pattern that the subscription shall match',
    example: 'developer',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  searchPattern?: string;
}
