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
import { JobSubscription } from './entities/job-subscription.entity';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @Post()
  create(@Body() createSubscriptionDto: CreateJobSubscriptionDto) {
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
  ): Promise<JobSubscription[]> {
    return this.subscriptionsService.findAll(queryDto);
  }

  /* 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(+id, updateSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(+id);
  } */
}
