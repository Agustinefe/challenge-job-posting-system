import { GetJobDto } from '../../jobs/dto/get-job.dto';

export class SendNewJobAlertEmailsJobDto {
  public static name = 'send-new-job-alert-emails';

  idempotentKey: string;

  job: GetJobDto;

  offset: number;

  limit: number;
}
