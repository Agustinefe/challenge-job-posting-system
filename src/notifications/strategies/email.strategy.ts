import { Injectable } from '@nestjs/common';
import { NotificationBaseStrategy } from './base.strategy';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Notification } from '../entities/notification.entity';
import { NotificationsRepository } from '../repositories/notifications.repository';
import { NotificationChannel } from '../entities/notification-channel.type';

@Injectable()
export class EmailNotificationStrategy implements NotificationBaseStrategy {
  constructor(private notificationRepository: NotificationsRepository) { }

  getName(): NotificationChannel {
    return NotificationChannel.EMAIL;
  }

  async send(createNotificationDto: CreateNotificationDto) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const { receiverEmails } = createNotificationDto;
    console.log(`Sending email to ${receiverEmails!.join(', ')}`);
  }

  async register(
    notificationData: CreateNotificationDto,
  ): Promise<Notification> {
    return await this.notificationRepository.insert(notificationData);
  }
}
