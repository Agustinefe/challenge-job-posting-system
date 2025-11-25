import axios, { AxiosInstance } from 'axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchJobsQueryDto } from '../dto/search-jobs-query.dto';
import {
  GetJobsFromExternalSourceResponse,
  GetJobsFromExternalSourceResponseSchema,
} from '../dto/get-jobs-from-external-source-response.dto';

@Injectable()
export class JobberwockyExternalSource {
  private readonly caller: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.caller = axios.create({
      baseURL: this.configService.get<string>(
        'JOBBERWOCKY_EXTERNAL_SOURCE_URL',
        'http://localhost:8081/',
      ),
    });
  }

  async getJobs(
    query: SearchJobsQueryDto,
  ): Promise<GetJobsFromExternalSourceResponse> {
    const { data: result } = await this.caller.get('/jobs', { params: query });
    const { error, value } =
      GetJobsFromExternalSourceResponseSchema.validate(result);
    if (error) throw new BadRequestException(error.message);
    return value;
  }
}
