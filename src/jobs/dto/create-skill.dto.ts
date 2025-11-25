import { OmitType } from '@nestjs/swagger';
import { SkillDto } from './skill.dto';

export class CreateSkillDto extends OmitType(SkillDto, ['id'] as const) { }
