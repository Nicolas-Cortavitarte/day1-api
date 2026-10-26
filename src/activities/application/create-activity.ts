import { Injectable } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';

export interface CreateActivityInput {
  userId: string;
  categoryId: number;
  title: string;
  description?: string | null;
  scheduledDate: string;
  startTime?: string | null;
  durationMinutes?: number | null;
}

@Injectable()
export class CreateActivity {
  constructor(private readonly activities: ActivityRepository) {}

  execute(input: CreateActivityInput): Promise<Activity> {
    return this.activities.create({
      userId: input.userId,
      categoryId: input.categoryId,
      title: input.title,
      description: input.description ?? null,
      scheduledDate: input.scheduledDate,
      startTime: input.startTime ?? null,
      durationMinutes: input.durationMinutes ?? null,
    });
  }
}