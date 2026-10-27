import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseRepository, NewExercise } from '../application/exercise-repository';
import { Exercise } from '../domain/exercise';

@Injectable()
export class PrismaExerciseRepository extends ExerciseRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAvailableFor(userId: string): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({
      where: { deletedAt: null, OR: [{ userId: null }, { userId }] },
      orderBy: { name: 'asc' },
    });
  }

  async create(exercise: NewExercise): Promise<Exercise> {
    return this.prisma.exercise.create({ data: exercise });
  }
}