import { Module } from '@nestjs/common';
import { JobAlertsConsumer } from './consumers/job-alerts.consumer';
import { SubscriptionsModule } from '../../src/jobs/subscriptions/subscriptions.module';
import { NotificationsModule } from '../../src/notifications/notifications.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SubscriptionsModule,
    NotificationsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('TASK_QUEUE_HOST'),
          port: configService.get('TASK_QUEUE_PORT'),
          password: configService.get('TASK_QUEUE_PASSWORD'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'job-alerts',
    }),
  ],
  providers: [JobAlertsConsumer],
  exports: [BullModule],
})
export class TasksQueueModule { }
