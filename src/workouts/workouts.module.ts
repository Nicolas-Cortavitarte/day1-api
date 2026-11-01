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
import { ExerciseProgressController } from './presentation/exercise-progress.controller';
import { WorkoutHistoryRepository } from './application/workout-history-repository';
import { PrismaWorkoutHistoryRepository } from './infrastructure/prisma-workout-history-repository';
import { ListWorkoutHistory } from './application/list-workout-history';
import { ExerciseProgressRepository } from './application/exercise-progress-repository';
import { PrismaExerciseProgressRepository } from './infrastructure/prisma-exercise-progress-repository';
import { GetExerciseProgress } from './application/get-exercise-progress';
import { WorkoutHistoryController } from './presentation/workout-history.controller';

@Module({
  imports: [ActivitiesModule, ExercisesModule],
  controllers: [WorkoutsController, WorkoutSetsController, ExerciseProgressController, WorkoutHistoryController],
  providers: [
    { provide: WorkoutSessionRepository, useClass: PrismaWorkoutSessionRepository },
    { provide: WorkoutSessionExerciseRepository, useClass: PrismaWorkoutSessionExerciseRepository },
    AddExerciseToSession,
    { provide: WorkoutSetRepository, useClass: PrismaWorkoutSetRepository}, LogSet,
    { provide: WorkoutSessionDetailRepository, useClass: PrismaWorkoutSessionDetailRepository },
    GetWorkoutSession,
    { provide: WorkoutHistoryRepository, useClass: PrismaWorkoutHistoryRepository },
    ListWorkoutHistory,
    { provide: ExerciseProgressRepository, useClass: PrismaExerciseProgressRepository },
    GetExerciseProgress,
  ],
})
export class WorkoutsModule {}