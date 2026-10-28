import { Module } from '@nestjs/common';
import { ActivitiesModule } from '../activities/activities.module';
import { ExercisesModule } from '../exercises/exercises.module';
import { AddExerciseToSession } from './application/add-exercise-to-session';
import { WorkoutSessionExerciseRepository } from './application/workout-session-exercise-repository';
import { WorkoutSessionRepository } from './application/workout-session-repository';
import { PrismaWorkoutSessionExerciseRepository } from './infrastructure/prisma-workout-session-exercise-repository';
import { PrismaWorkoutSessionRepository } from './infrastructure/prisma-workout-session-repository';
import { WorkoutsController } from './presentation/workouts.controller';
import { WorkoutSetsController } from './presentation/workout-sets.controller';
import { WorkoutSetRepository } from './application/workout-set-repository';
import { PrismaWorkoutSetRepository } from './infrastructure/prisma-workout-set-repository';
import { LogSet } from './application/log-set';
import { WorkoutSessionDetailRepository } from './application/workout-session-detail-repository';
import { PrismaWorkoutSessionDetailRepository } from './infrastructure/prisma-workout-session-detail-repository';
import { GetWorkoutSession } from './application/get-workout-session';

@Module({
  imports: [ActivitiesModule, ExercisesModule],
  controllers: [WorkoutsController, WorkoutSetsController],
  providers: [
    { provide: WorkoutSessionRepository, useClass: PrismaWorkoutSessionRepository },
    { provide: WorkoutSessionExerciseRepository, useClass: PrismaWorkoutSessionExerciseRepository },
    AddExerciseToSession,
    { provide: WorkoutSetRepository, useClass: PrismaWorkoutSetRepository}, LogSet,
    { provide: WorkoutSessionDetailRepository, useClass: PrismaWorkoutSessionDetailRepository },
    GetWorkoutSession,
  ],
})
export class WorkoutsModule {}