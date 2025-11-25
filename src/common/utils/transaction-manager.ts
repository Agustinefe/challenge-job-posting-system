import { Logger } from '@nestjs/common';

type Compensation = () => Promise<any>;

interface CompensationEntry {
  description: string;
  compensation: Compensation;
}

export class TransactionManager {
  private compensations: CompensationEntry[] = [];
  private readonly logger = new Logger(TransactionManager.name);

  public async run<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  public addCompensation(description: string, compensation: Compensation) {
    this.compensations.push({ description, compensation });
  }

  private async rollback() {
    for (const { description, compensation } of this.compensations.reverse()) {
      try {
        this.logger.log(`Rolling back: ${description}`);
        await compensation();
      } catch (err) {
        this.logger.error(
          `Rollback step failed for "${description}":
          ${err}`,
        );
      }
    }
  }
}
