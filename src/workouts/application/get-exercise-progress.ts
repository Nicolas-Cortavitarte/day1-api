import { Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseRepository } from '../../exercises/application/exercise-repository';
import { ExerciseProgressPoint } from '../domain/exercise-progress-point';
import { ExerciseProgressRepository } from './exercise-progress-repository';

@Injectable()
export class GetExerciseProgress {
  constructor(
    private readonly exercises: ExerciseRepository,
    private readonly progress: ExerciseProgressRepository,
  ) {}

  async execute(exerciseId: string, userId: string): Promise<ExerciseProgressPoint[]> {
    const exercise = await this.exercises.findById(exerciseId);
    if (!exercise || (exercise.userId !== null && exercise.userId !== userId)) {
      throw new NotFoundException('Ejercicio no encontrado');
    }
    return this.progress.findForExercise(exerciseId, userId);
  }
}