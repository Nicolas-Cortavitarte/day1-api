import { Body, Controller, Get, Post } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { CreateExercise } from '../application/create-exercise';
import { ListAvailableExercises } from '../application/list-available-exercises';
import { CreateExerciseDto } from './create-exercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly listExercises: ListAvailableExercises,
    private readonly createExercise: CreateExercise,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.listExercises.execute(user.id);
  }

  @Post()
  create(@Body() dto: CreateExerciseDto, @CurrentUser() user: AuthenticatedUser) {
    return this.createExercise.execute({ ...dto, userId: user.id });
  }
}