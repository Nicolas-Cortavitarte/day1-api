import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { fromDateOnly } from '../../shared/date-conversion';
import { ExerciseProgressPoint } from '../domain/exercise-progress-point';
import { ExerciseProgressRepository } from '../application/exercise-progress-repository';

type SetRow = {
  reps: number | null;
  weightValue: { toNumber(): number } | null;
  weightUnit: string | null;
  durationSeconds: number | null;
};

@Injectable()
export class PrismaExerciseProgressRepository extends ExerciseProgressRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findForExercise(exerciseId: string, userId: string): Promise<ExerciseProgressPoint[]> {
    const rows = await this.prisma.workoutSessionExercise.findMany({
      where: { exerciseId, session: { activity: { userId, deletedAt: null } } },
      include: { session: { include: { activity: true } }, sets: true },
      orderBy: { session: { activity: { scheduledDate: 'asc' } } },
    });

    return rows
      .filter((row) => row.sets.length > 0)
      .map((row) => ({
        sessionId: row.sessionId,
        date: fromDateOnly(row.session.activity.scheduledDate),
        ...bestSet(row.sets),
      }));
  }
}

function bestSet(sets: SetRow[]) {
  const withWeight = sets.filter((s) => s.weightValue != null);
  const pool = withWeight.length > 0 ? withWeight : sets;

  const best = pool.reduce((top, current) => {
    const topValue = top.weightValue ? top.weightValue.toNumber() : (top.reps ?? 0);
    const currentValue = current.weightValue ? current.weightValue.toNumber() : (current.reps ?? 0);
    return currentValue > topValue ? current : top;
  });

  return {
    bestWeightValue: best.weightValue ? best.weightValue.toNumber() : null,
    weightUnit: best.weightUnit as ExerciseProgressPoint['weightUnit'],
    reps: best.reps,
    durationSeconds: best.durationSeconds,
  };
}