import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'BullQueue_job-alerts',
      useValue: {
        add: jest.fn(),
        addBulk: jest.fn(),
        close: jest.fn(),
      },
    },
  ],
  exports: ['BullQueue_job-alerts'],
})
export class MockedTasksQueueModule { }
