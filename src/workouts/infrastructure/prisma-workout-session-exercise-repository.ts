import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NewSessionExercise, WorkoutSessionExerciseRepository } from '../application/workout-session-exercise-repository';
import { WorkoutSessionExercise } from '../domain/workout-session-exercise';

@Injectable()
export class PrismaWorkoutSessionExerciseRepository extends WorkoutSessionExerciseRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  countForSession(sessionId: string): Promise<number> {
    return this.prisma.workoutSessionExercise.count({ where: { sessionId } });
  }

  async add(input: NewSessionExercise): Promise<WorkoutSessionExercise> {
    const nextPosition = (await this.countForSession(input.sessionId)) + 1;
    return this.prisma.workoutSessionExercise.create({
      data: { sessionId: input.sessionId, exerciseId: input.exerciseId, notes: input.notes, position: nextPosition },
    });
  }

  async findById(id: string): Promise<WorkoutSessionExercise | null> {
    return this.prisma.workoutSessionExercise.findUnique({ where: {id} });
  }
}