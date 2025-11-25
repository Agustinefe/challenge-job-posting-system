import { GetJobDto } from '../../jobs/dto/get-job.dto';

export class StartBatchJobNotificationJobDto {
  public static name = 'start-job-notification';

  job: GetJobDto;
}
