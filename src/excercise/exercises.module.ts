import { Module } from '@nestjs/common';
import { CreateExercise } from './application/create-exercise';
import { ExerciseRepository } from './application/exercise-repository';
import { ListAvailableExercises } from './application/list-available-exercises';
import { PrismaExerciseRepository } from './infrastructure/prisma-exercise-repository';
import { ExercisesController } from './presentation/exercises.controller';

@Module({
  controllers: [ExercisesController],
  providers: [
    { provide: ExerciseRepository, useClass: PrismaExerciseRepository },
    ListAvailableExercises,
    CreateExercise,
  ],
})
export class ExercisesModule {}