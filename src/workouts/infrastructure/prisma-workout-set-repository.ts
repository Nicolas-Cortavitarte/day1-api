import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NewWorkoutSet, WorkoutSetRepository } from '../application/workout-set-repository';
import { WorkoutSet } from '../domain/workout-set';

@Injectable()
export class PrismaWorkoutSetRepository extends WorkoutSetRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  countForSessionExercise(sessionExerciseId: string): Promise<number> {
    return this.prisma.workoutSet.count({ where: { sessionExerciseId } });
  }

  async create(set: NewWorkoutSet): Promise<WorkoutSet> {
    const nextSetNumber = (await this.countForSessionExercise(set.sessionExerciseId)) + 1;
    const row = await this.prisma.workoutSet.create({
      data: { ...set, setNumber: nextSetNumber },
    });
    return toDomain(row);
  }
}

function toDomain(row: {
  id: string; sessionExerciseId: string; setNumber: number; reps: number | null;
  weightValue: { toNumber: () => number } | null; weightUnit: string | null;
  durationSeconds: number | null; completedAt: Date | null;
}): WorkoutSet {
  return {
    id: row.id,
    sessionExerciseId: row.sessionExerciseId,
    setNumber: row.setNumber,
    reps: row.reps,
    weightValue: row.weightValue ? row.weightValue.toNumber() : null,
    weightUnit: row.weightUnit as WorkoutSet['weightUnit'],
    durationSeconds: row.durationSeconds,
    completedAt: row.completedAt,
  };
}