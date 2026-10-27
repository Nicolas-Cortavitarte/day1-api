import { Module } from '@nestjs/common';
import { ActivitiesModule } from '../activities/activities.module';
import { ExercisesModule } from '../excercises/exercises.module';
import { AddExerciseToSession } from './application/add-exercise-to-session';
import { WorkoutSessionExerciseRepository } from './application/workout-session-exercise-repository';
import { WorkoutSessionRepository } from './application/workout-session-repository';
import { PrismaWorkoutSessionExerciseRepository } from './infrastructure/prisma-workout-session-exercise-repository';
import { PrismaWorkoutSessionRepository } from './infrastructure/prisma-workout-session-repository';
import { WorkoutsController } from './presentation/workouts.controller';

@Module({
  imports: [ActivitiesModule, ExercisesModule],
  controllers: [WorkoutsController],
  providers: [
    { provide: WorkoutSessionRepository, useClass: PrismaWorkoutSessionRepository },
    { provide: WorkoutSessionExerciseRepository, useClass: PrismaWorkoutSessionExerciseRepository },
    AddExerciseToSession,
  ],
})
export class WorkoutsModule {}