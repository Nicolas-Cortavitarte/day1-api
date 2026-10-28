import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkoutSessionDetailRepository } from '../application/workout-session-detail-repository';
import { WorkoutSessionDetail } from '../domain/workout-session-detail';

@Injectable()
export class PrismaWorkoutSessionDetailRepository extends WorkoutSessionDetailRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findBySessionId(sessionId: string): Promise<WorkoutSessionDetail | null> {
    const row = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: {
        exercises: {
          orderBy: { position: 'asc' },
          include: { exercise: true, sets: { orderBy: { setNumber: 'asc' } } },
        },
      },
    });
    return row ? toDomain(row) : null;
  }
}

function toDomain(row: any): WorkoutSessionDetail {
  return {
    id: row.id,
    activityId: row.activityId,
    startedAt: row.startedAt,
    endedAt: row.endedAt,
    notes: row.notes,
    exercises: row.exercises.map((se: any) => ({
      id: se.id,
      exerciseId: se.exerciseId,
      exerciseName: se.exercise.name,
      position: se.position,
      notes: se.notes,
      sets: se.sets.map((s: any) => ({
        id: s.id,
        setNumber: s.setNumber,
        reps: s.reps,
        weightValue: s.weightValue ? s.weightValue.toNumber() : null,
        weightUnit: s.weightUnit,
        durationSeconds: s.durationSeconds,
        completedAt: s.completedAt,
      })),
    })),
  };
}