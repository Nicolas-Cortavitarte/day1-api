import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityRecurrence } from '../domain/activity-recurrence';
import { ActivityRecurrenceRepository } from './activity-recurrence-repository';

export interface UpdateActivityRecurrenceInput {
  recurrenceId: string;
  userId: string;
  categoryId?: number;
  title?: string;
  description?: string;
  durationMinutes?: number;
  reminderMinutes?: number;
}

@Injectable()
export class UpdateActivityRecurrence {
  constructor(private readonly recurrences: ActivityRecurrenceRepository) {}

  async execute(input: UpdateActivityRecurrenceInput): Promise<ActivityRecurrence> {
    const recurrence = await this.recurrences.findById(input.recurrenceId);
    if (!recurrence || recurrence.userId !== input.userId) {
      throw new NotFoundException('Repetición no encontrada');
    }

    return this.recurrences.updateAndCascade(input.recurrenceId, {
      categoryId: input.categoryId,
      title: input.title,
      description: input.description,
      durationMinutes: input.durationMinutes,
      reminderMinutes: input.reminderMinutes,
    });
  }
}