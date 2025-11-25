import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { NotificationChannel } from './notification-channel.type';

@Entity('notifications')
export class Notification {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @CreateDateColumn()
  sentAt: Date;

  @Column({ type: 'simple-array', nullable: true, default: null })
  receiverEmails: string[] | null;
}
