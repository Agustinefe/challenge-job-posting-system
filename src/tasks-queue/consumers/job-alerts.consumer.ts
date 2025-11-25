import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { StartBatchJobNotificationJobDto } from '../dto/start-batch-job-notification-job.dto';
import { NotificationsService } from '../../notifications/notifications.service';
import { CreateNotificationDto } from '../../notifications/dto/create-notification.dto';
import { NotificationChannel } from '../../notifications/entities/notification-channel.type';
import { SendNewJobAlertEmailsJobDto } from '../dto/send-new-job-alert-emails-job.dto';
import { SubscriptionsService } from '../../jobs/subscriptions/subscriptions.service';

@Processor('job-alerts')
export class JobAlertsConsumer extends WorkerHost {
  private readonly LIMIT = 5;
  constructor(
    private readonly subscriptionService: SubscriptionsService,
    private readonly notificationService: NotificationsService,
    @InjectQueue('job-alerts') private taskqueue: Queue,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case StartBatchJobNotificationJobDto.name:
        await this.startBatchJobNotification(
          job.data as StartBatchJobNotificationJobDto,
        );
        break;
      case SendNewJobAlertEmailsJobDto.name:
        await this.sendNewJobSubscriptionEmails(
          job.data as SendNewJobAlertEmailsJobDto,
        );
    }
    return Promise.resolve();
  }

  private async startBatchJobNotification({
    job,
  }: StartBatchJobNotificationJobDto) {
    const subscribersCount = await this.subscriptionService.countSubscriptions({
      searchPattern: job.name,
    });

    const { v4 } = await import('uuid');

    for (let offset = 0; offset < subscribersCount; offset += this.LIMIT) {
      const taskData: SendNewJobAlertEmailsJobDto = {
        idempotentKey: v4(),
        job,
        offset,
        limit: this.LIMIT,
      };
      await this.taskqueue.add(SendNewJobAlertEmailsJobDto.name, taskData);
    }
  }

  private async sendNewJobSubscriptionEmails({
    idempotentKey,
    job,
    offset,
    limit,
  }: SendNewJobAlertEmailsJobDto) {
    if (await this.notificationService.notificationHasBeenSent(idempotentKey))
      return;

    const subscribers = await this.subscriptionService.findAll(
      {
        searchPattern: job.name,
      },
      {
        offset,
        limit,
      },
    );

    const emailData: CreateNotificationDto = {
      id: idempotentKey,
      title: 'New job for you!',
      content: `Hey there! We think this job would match with you: ${job.name}`,
      channel: NotificationChannel.EMAIL,
      receiverEmails: subscribers.map((s) => s.email),
    };

    await this.notificationService.send(emailData);
  }
}
