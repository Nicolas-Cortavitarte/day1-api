import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityRepository } from './activity-repository';

export interface DeleteActivityInput {
  activityId: string;
  userId: string;
}

@Injectable()
export class DeleteActivity {
  constructor(private readonly activities: ActivityRepository) {}

  async execute(input: DeleteActivityInput): Promise<void> {
    const activity = await this.activities.findById(input.activityId);
    if (!activity || activity.userId !== input.userId) {
      throw new NotFoundException('Actividad no encontrada');
    }
    await this.activities.softDelete(input.activityId);
  }
}