import { Injectable } from '@nestjs/common';
import { Exercise } from '../domain/exercise';
import { ExerciseRepository } from './exercise-repository';

@Injectable()
export class ListAvailableExercises {
  constructor(private readonly exercises: ExerciseRepository) {}
  execute(userId: string): Promise<Exercise[]> {
    return this.exercises.findAvailableFor(userId);
  }
}