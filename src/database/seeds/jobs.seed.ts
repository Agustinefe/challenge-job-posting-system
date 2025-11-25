import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Skill } from '../../jobs/entities/skills.entity';
import data from '../../../seed-data/jobs.json';
import { Job } from '../../jobs/entities/job.entity';

export default class JobSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const skillsRepository = dataSource.getRepository(Skill);
    const jobsRepository = dataSource.getRepository(Job);
    const skills = await skillsRepository.find();
    const jobs: Job[] = data.map((job) => {
      const jobEntity = new Job();
      jobEntity.name = job.name;
      jobEntity.salary = job.salary;
      jobEntity.country = job.country;
      jobEntity.skills = skills.filter((skill) =>
        job.skills.includes(skill.name),
      );
      return jobEntity;
    });
    const entities = jobsRepository.create(jobs);
    await jobsRepository.save(entities);
  }
}
