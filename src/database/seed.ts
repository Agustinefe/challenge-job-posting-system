import { AppDataSource } from '../data-source';
import { runSeeders } from 'typeorm-extension';

async function run() {
  await AppDataSource.initialize();
  await AppDataSource.dropDatabase();
  await AppDataSource.synchronize(true);
  await runSeeders(AppDataSource);
  await AppDataSource.destroy();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
