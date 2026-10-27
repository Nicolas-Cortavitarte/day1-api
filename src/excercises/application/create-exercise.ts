import { Injectable } from '@nestjs/common';
import { Exercise } from '../domain/exercise';
import { ExerciseRepository } from './exercise-repository';

export interface CreateExerciseInput {
  userId: string;
  name: string;
  muscleGroup?: string | null;
}

@Injectable()
export class CreateExercise {
  constructor(private readonly exercises: ExerciseRepository) {}
  execute(input: CreateExerciseInput): Promise<Exercise> {
    return this.exercises.create({ userId: input.userId, name: input.name, muscleGroup: input.muscleGroup ?? null });
  }
}