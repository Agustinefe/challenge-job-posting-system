import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationChannel } from '../entities/notification-channel.type';

export class NotificationDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsOptional()
  @IsEmail({}, { each: true })
  receiverEmails?: string[] | null;

  @IsDate()
  sentAt: Date;
}
