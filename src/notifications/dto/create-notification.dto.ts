import { OmitType } from '@nestjs/swagger';
import { NotificationDto } from './notification.dto';

export class CreateNotificationDto extends OmitType(NotificationDto, [
  'sentAt',
]) { }
