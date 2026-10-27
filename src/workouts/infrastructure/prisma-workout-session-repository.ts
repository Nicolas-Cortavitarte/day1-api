import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkoutSessionRepository } from '../application/workout-session-repository';
import { WorkoutSession } from '../domain/workout-session';

@Injectable()
export class PrismaWorkoutSessionRepository extends WorkoutSessionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByActivityId(activityId: string): Promise<WorkoutSession | null> {
    return this.prisma.workoutSession.findUnique({ where: { activityId } });
  }

  async findById(id: string): Promise<WorkoutSession | null> {
    return this.prisma.workoutSession.findUnique({ where: {id} });
  }
}