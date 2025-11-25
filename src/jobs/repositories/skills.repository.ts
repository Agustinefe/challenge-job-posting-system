import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { HandleDBExceptions } from '../../database/decorators';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { Skill } from '../entities/skills.entity';
import { slugify } from '../../common/utils/slugify';

@Injectable()
export class SkillsRepository {
  constructor(
    @InjectRepository(Skill)
    private repository: Repository<Skill>,
  ) { }

  @HandleDBExceptions()
  async findBySkill(
    skillNames: string[],
    select?: (keyof Skill)[],
  ): Promise<Skill[]> {
    const skillSlugs = skillNames.map(slugify);
    return this.repository.find({ select, where: { slug: In(skillSlugs) } });
  }

  @HandleDBExceptions()
  async createMany(skills: CreateSkillDto[]): Promise<Skill[]> {
    const entities = this.repository.create(skills);
    return this.repository.save(entities);
  }

  @HandleDBExceptions()
  async deleteMany(skills: Skill[]): Promise<Skill[]> {
    return this.repository.remove(skills);
  }
}
