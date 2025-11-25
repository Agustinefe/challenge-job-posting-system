import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { runSeeders } from 'typeorm-extension';
import { MockedTasksQueueModule } from '../mocks/tasks-queue.module.mock';
import { TasksQueueModule } from '../../src/tasks-queue/tasks-queue.module';

export class TestHelper {
  app: INestApplication;
  dataSource: DataSource;

  private constructor(app: INestApplication, dataSource: DataSource) {
    this.app = app;
    this.dataSource = dataSource;
  }

  public static async initTestApp(): Promise<TestHelper> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(TasksQueueModule)
      .useModule(MockedTasksQueueModule)
      .compile();

    const app = moduleFixture.createNestApplication();

    // First, get the DataSource and restore it before initializing the app
    const dataSource = moduleFixture.get<DataSource>(DataSource);
    await dataSource.dropDatabase();
    await dataSource.synchronize();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Initialize the app
    await app.init();

    return new TestHelper(app, dataSource);
  }

  public async closeTestApp(): Promise<void> {
    await this.dataSource.dropDatabase();
    await this.dataSource.destroy();
    await this.app.close();
  }

  public async resetTestApp(): Promise<void> {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize(true);
  }

  public async seedTestApp(): Promise<void> {
    await runSeeders(this.dataSource);
  }
}
