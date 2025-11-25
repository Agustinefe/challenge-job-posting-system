import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { JobSubscriptionsRepository } from './repositories/job-subscriptions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSubscription } from './entities/job-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobSubscription])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, JobSubscriptionsRepository],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule { }
