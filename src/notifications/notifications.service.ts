import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { NotificationBaseStrategy } from './strategies/base.strategy';
import { NotificationChannelMapper } from './mappers/notification-channel.mapper';
import { NotificationsRepository } from './repositories/notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private notificationChannelMapper: NotificationChannelMapper,
  ) { }

  async notificationHasBeenSent(idempotentKey: string): Promise<boolean> {
    return !!(await this.notificationsRepository.find(idempotentKey));
  }

  async send(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationDto> {
    const notifier: NotificationBaseStrategy =
      this.notificationChannelMapper.getStrategy(createNotificationDto.channel);

    await notifier.send(createNotificationDto);

    return await notifier.register(createNotificationDto);
  }
}
