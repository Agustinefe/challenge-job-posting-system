import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { GetJobSubscriptionQueryDto } from './dto/get-job-subscriptions-query.dto';
import { CreateJobSubscriptionDto } from './dto/create-job-subscription.dto';
import { JobSubscriptionDto } from './dto/job-subscription.dto';

@Controller('jobs/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @Post()
  create(
    @Body() createSubscriptionDto: CreateJobSubscriptionDto,
  ): Promise<JobSubscriptionDto> {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    queryDto: GetJobSubscriptionQueryDto,
  ): Promise<JobSubscriptionDto[]> {
    return this.subscriptionsService.findAll(queryDto);
  }
}
