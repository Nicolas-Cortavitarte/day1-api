import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityRepository } from '../../activities/application/activity-repository';
import { WorkoutSet, WeightUnit } from '../domain/workout-set';
import { WorkoutSessionExerciseRepository } from './workout-session-exercise-repository';
import { WorkoutSessionRepository } from './workout-session-repository';
import { WorkoutSetRepository } from './workout-set-repository';

export interface LogSetInput {
  sessionExerciseId: string;
  userId: string;
  reps?: number | null;
  weightValue?: number | null;
  weightUnit?: WeightUnit | null;
  durationSeconds?: number | null;
  completed?: boolean;
}

@Injectable()
export class LogSet {
  constructor(
    private readonly activities: ActivityRepository,
    private readonly sessions: WorkoutSessionRepository,
    private readonly sessionExercises: WorkoutSessionExerciseRepository,
    private readonly sets: WorkoutSetRepository,
  ) {}

  async execute(input: LogSetInput): Promise<WorkoutSet> {
    const sessionExercise = await this.sessionExercises.findById(input.sessionExerciseId);
    if (!sessionExercise) throw new NotFoundException('Ejercicio de sesión no encontrado');

    const session = await this.sessions.findById(sessionExercise.sessionId);
    if (!session) throw new NotFoundException('Sesión no encontrada');

    const activity = await this.activities.findById(session.activityId);
    if (!activity || activity.userId !== input.userId) {
      throw new NotFoundException('Ejercicio de sesión no encontrado');
    }

    return this.sets.create({
      sessionExerciseId: input.sessionExerciseId,
      reps: input.reps ?? null,
      weightValue: input.weightValue ?? null,
      weightUnit: input.weightUnit ?? null,
      durationSeconds: input.durationSeconds ?? null,
      completedAt: input.completed ? new Date() : null,
    });
  }
}