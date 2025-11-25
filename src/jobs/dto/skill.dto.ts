import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SkillDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
