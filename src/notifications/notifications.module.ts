import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsRepository } from './repositories/notifications.repository';
import { Notification } from './entities/notification.entity';
import { NotificationChannelMapper } from './mappers/notification-channel.mapper';
import { EmailNotificationStrategy } from './strategies/email.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    NotificationsService,
    NotificationsRepository,
    NotificationChannelMapper,
    EmailNotificationStrategy,
    {
      provide: 'NOTIFICATION_STRATEGIES',
      useFactory: (email: EmailNotificationStrategy) => [email],
      inject: [EmailNotificationStrategy],
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule { }
