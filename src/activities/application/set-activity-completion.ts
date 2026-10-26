import { Injectable, NotFoundException } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';

export interface SetActivityCompletionInput {
  activityId: string;
  userId: string;
  completed: boolean;
}

@Injectable()
export class SetActivityCompletion {
  constructor(private readonly activities: ActivityRepository) {}

  async execute(input: SetActivityCompletionInput): Promise<Activity> {
    const activity = await this.activities.findById(input.activityId);

    if (!activity || activity.userId !== input.userId) {
      throw new NotFoundException('Actividad no encontrada');
    }

    return this.activities.setCompletedAt(input.activityId, input.completed ? new Date() : null);
  }
}