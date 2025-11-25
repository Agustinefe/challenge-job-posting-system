import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import data from '../../../seed-data/job-subscriptions.json';
import { JobSubscription } from '../../jobs/subscriptions/entities/job-subscription.entity';

export default class JobSubscriptionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(JobSubscription);

    const jobSubscriptions: JobSubscription[] = data.map((js) => {
      const entity = new JobSubscription();
      entity.email = js.email;
      entity.searchPattern = js.searchPattern;
      return entity;
    });
    const entities = repository.create(jobSubscriptions);
    await repository.save(entities);
  }
}
