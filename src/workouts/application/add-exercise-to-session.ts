import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityRepository } from '../../activities/application/activity-repository';
import { ExerciseRepository } from '../../excercises/application/exercise-repository';
import { WorkoutSessionExercise } from '../domain/workout-session-exercise';
import { WorkoutSessionExerciseRepository } from './workout-session-exercise-repository';
import { WorkoutSessionRepository } from './workout-session-repository';

export interface AddExerciseToSessionInput {
  activityId: string;
  userId: string;
  exerciseId: string;
  notes?: string | null;
}

@Injectable()
export class AddExerciseToSession {
  constructor(
    private readonly activities: ActivityRepository,
    private readonly sessions: WorkoutSessionRepository,
    private readonly sessionExercises: WorkoutSessionExerciseRepository,
    private readonly exercises: ExerciseRepository,
  ) {}

  async execute(input: AddExerciseToSessionInput): Promise<WorkoutSessionExercise> {
    const activity = await this.activities.findById(input.activityId);
    if (!activity || activity.userId !== input.userId) {
      throw new NotFoundException('Actividad no encontrada');
    }

    const session = await this.sessions.findByActivityId(input.activityId);
    if (!session) {
      throw new NotFoundException('Esta actividad no tiene una sesión de gimnasio');
    }

    const exercise = await this.exercises.findById(input.exerciseId);
    if (!exercise || (exercise.userId !== null && exercise.userId !== input.userId)) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    return this.sessionExercises.add({ sessionId: session.id, exerciseId: input.exerciseId, notes: input.notes ?? null });
  }
}