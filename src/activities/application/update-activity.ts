import { Injectable, NotFoundException } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';

export interface UpdateActivityInput {
  activityId: string;
  userId: string;
  categoryId?: number;
  title?: string;
  description?: string;
  durationMinutes?: number;
}

@Injectable()
export class UpdateActivity {
  constructor(private readonly activities: ActivityRepository) {}

  async execute(input: UpdateActivityInput): Promise<Activity> {
    const activity = await this.activities.findById(input.activityId);
    if (!activity || activity.userId !== input.userId) {
      throw new NotFoundException('Actividad no encontrada');
    }

    return this.activities.update(input.activityId, {
      categoryId: input.categoryId,
      title: input.title,
      description: input.description,
      durationMinutes: input.durationMinutes,
    });
  }
}