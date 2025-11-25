import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Skill } from './entities/skills.entity';
import { JobsRepository } from './repositories/jobs.repository';
import { SkillsRepository } from './repositories/skills.repository';
import { JobberwockyExternalSource } from './repositories/jobberwocky.external';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TasksQueueModule } from '../../src/tasks-queue/tasks-queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Skill]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL'),
      }),
      inject: [ConfigService],
    }),
    TasksQueueModule,
    SubscriptionsModule,
    NotificationsModule,
  ],
  controllers: [JobsController],
  providers: [
    JobsService,
    JobsRepository,
    SkillsRepository,
    JobberwockyExternalSource,
  ],
})
export class JobsModule { }
