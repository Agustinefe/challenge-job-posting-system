import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { GetJobDto } from './dto/get-job.dto';
import { SearchJobsQueryDto } from './dto/search-jobs-query.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiBody({ type: CreateJobDto })
  @ApiCreatedResponse({
    description: 'The job posting has been successfully created',
    type: CreateJobDto,
  })
  @Post()
  async create(@Body() createJobDto: CreateJobDto): Promise<GetJobDto> {
    return this.jobsService.create(createJobDto);
  }

  @ApiOperation({ summary: 'Get all job posting' })
  @ApiOkResponse({
    description: 'Returns all jobs',
    type: GetJobDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    queryDto: SearchJobsQueryDto,
  ): Promise<GetJobDto[]> {
    return await this.jobsService.findAll(queryDto);
  }

  /* @ApiOperation({ summary: 'Get all job posting' })
  @ApiOkResponse({
    description: 'Returns all jobs',
    type: String,
    isArray: false,
  })
  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @ApiOperation({ summary: 'Get a job by id' })
  @ApiParam({ name: 'id', description: 'The job id' })
  @ApiOkResponse({
    description: 'Returns the user with the specified id',
    type: String,
    isArray: false,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Partially update a job' })
  @ApiParam({ name: 'id', description: 'The job id' })
  @ApiBody({ type: UpdateJobDto })
  @ApiOkResponse({
    description: 'The job has been successfully updated',
    type: String,
    isArray: false,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @ApiOperation({ summary: 'Delete a job' })
  @ApiParam({ name: 'id', description: 'The job id' })
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'The job has been successfully deleted',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  } */
}
