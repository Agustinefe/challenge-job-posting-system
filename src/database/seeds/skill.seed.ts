import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Skill } from '../../jobs/entities/skills.entity';
import data from '../../../seed-data/skills.json';

export default class SkillSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Skill);
    const skills: Skill[] = data.map((skill) => {
      const skillEntity = new Skill();
      skillEntity.name = skill;
      return skillEntity;
    });
    const entities = repository.create(skills);
    await repository.save(entities);
  }
}
