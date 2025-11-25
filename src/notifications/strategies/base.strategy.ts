import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationChannel } from '../entities/notification-channel.type';
import { Notification } from '../entities/notification.entity';

export abstract class NotificationBaseStrategy {
  abstract getName(): NotificationChannel;
  abstract send(notificationData: CreateNotificationDto): Promise<void>;
  abstract register(
    notificationData: CreateNotificationDto,
  ): Promise<Notification>;
}
