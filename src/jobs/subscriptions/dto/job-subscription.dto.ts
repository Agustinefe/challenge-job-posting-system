import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JobSubscriptionDto {
  @ApiProperty({
    description: 'The subscription identifier',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The subscriber email',
    example: 'john@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The pattern that the subscription shall match',
    example: 'developer',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  searchPattern: string | null;
}
