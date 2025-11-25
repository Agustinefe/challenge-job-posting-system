import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NotificationBaseStrategy } from '../strategies/base.strategy';

@Injectable()
export class NotificationChannelMapper {
  private strategies: Map<string, NotificationBaseStrategy> = new Map();

  constructor(
    @Inject('NOTIFICATION_STRATEGIES') strategies: NotificationBaseStrategy[],
  ) {
    strategies.forEach((s) => this.strategies.set(s.getName(), s));
  }

  getStrategy(name: string): NotificationBaseStrategy {
    const strategy = this.strategies.get(name);
    if (!strategy) {
      throw new BadRequestException(
        `Notification strategy "${name}" not found`,
      );
    }
    return strategy;
  }
}
