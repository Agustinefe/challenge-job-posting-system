import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { JoiValidationSchema } from './config/joi.validation';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './jobs/jobs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TasksQueueModule } from './tasks-queue/tasks-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      validationSchema: JoiValidationSchema,
    }),
    DatabaseModule,
    JobsModule,
    NotificationsModule,
    TasksQueueModule,
  ],
})
export class AppModule { }
