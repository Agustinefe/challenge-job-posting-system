import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';
import { Job } from './jobs/entities/job.entity';
import { Skill } from './jobs/entities/skills.entity';
import SkillSeeder from './database/seeds/skill.seed';
import JobSeeder from './database/seeds/jobs.seed';
import JobSubscriptionSeeder from './database/seeds/job-subscription.seed';
import { JobSubscription } from './jobs/subscriptions/entities/job-subscription.entity';
import { Notification } from './notifications/entities/notification.entity';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432');
const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'password';
const database = process.env.DB_NAME || 'usersdb';
const synchronize = true; /* process.env.DATABASE_SYNC === 'true'; */

// Create data source configuration
const dataSourceConfig: DataSourceOptions & SeederOptions = {
  type: 'postgres' as const,
  host,
  port,
  username,
  password,
  database,
  entities: [Job, Skill, JobSubscription, Notification],
  synchronize,
  seeds: [SkillSeeder, JobSeeder, JobSubscriptionSeeder],
};

export const AppDataSource = new DataSource(dataSourceConfig);
