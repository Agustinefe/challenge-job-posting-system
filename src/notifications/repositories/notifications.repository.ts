import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HandleDBExceptions } from '../../database/decorators';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(Notification)
    private repository: Repository<Notification>,
  ) { }

  @HandleDBExceptions()
  async insert(
    notificationDataDto: CreateNotificationDto,
  ): Promise<Notification> {
    const entity = this.repository.create(notificationDataDto);
    return this.repository.save(entity);
  }

  @HandleDBExceptions()
  async find(id: string): Promise<Notification | null> {
    return await this.repository.findOne({ where: { id } });
  }
}
