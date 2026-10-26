import { Injectable, NotFoundException } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';

export interface RescheduleActivityInput {
  activityId: string;
  userId: string;
  toDate: string;
  toTime: string | null;
}

@Injectable()
export class RescheduleActivity {
  constructor(private readonly activities: ActivityRepository) {}

  async execute(input: RescheduleActivityInput): Promise<Activity> {
    const activity = await this.activities.findById(input.activityId);
    if (!activity || activity.userId !== input.userId) {
      throw new NotFoundException('Actividad no encontrada');
    }

    return this.activities.reschedule({
      activityId: input.activityId,
      fromDate: activity.scheduledDate,
      fromTime: activity.startTime,
      toDate: input.toDate,
      toTime: input.toTime,
    });
  }
}