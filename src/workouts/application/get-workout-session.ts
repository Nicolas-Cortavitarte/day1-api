import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityRepository } from '../../activities/application/activity-repository';
import { WorkoutSessionDetail } from '../domain/workout-session-detail';
import { WorkoutSessionDetailRepository } from './workout-session-detail-repository';
import { WorkoutSessionRepository } from './workout-session-repository';

export interface GetWorkoutSessionInput {
  activityId: string;
  userId: string;
}

@Injectable()
export class GetWorkoutSession {
  constructor(
    private readonly activities: ActivityRepository,
    private readonly sessions: WorkoutSessionRepository,
    private readonly detail: WorkoutSessionDetailRepository,
  ) {}

  async execute(input: GetWorkoutSessionInput): Promise<WorkoutSessionDetail> {
    const activity = await this.activities.findById(input.activityId);
    if (!activity || activity.userId !== input.userId) {
      throw new NotFoundException('Actividad no encontrada');
    }

    const session = await this.sessions.findByActivityId(input.activityId);
    if (!session) {
      throw new NotFoundException('Esta actividad no tiene una sesión de gimnasio');
    }

    const result = await this.detail.findBySessionId(session.id);
    if (!result) throw new NotFoundException('Sesión no encontrada');
    return result;
  }
}