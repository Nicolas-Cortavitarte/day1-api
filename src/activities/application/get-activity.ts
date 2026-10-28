import { Injectable, NotFoundException } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';

export interface GetActivityInput {
  activityId: string;
  userId: string;
}

@Injectable()
export class GetActivity {
  constructor(private readonly activities: ActivityRepository) {}

  async execute(input: GetActivityInput): Promise<Activity> {
    const activity = await this.activities.findById(input.activityId);
    if (!activity || activity.userId !== input.userId) {
      throw new NotFoundException('Actividad no encontrada');
    }
    return activity;
  }
}