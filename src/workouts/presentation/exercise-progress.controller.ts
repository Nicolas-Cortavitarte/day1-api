import { Controller, Get, Param } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { GetExerciseProgress } from '../application/get-exercise-progress';

@Controller('exercises')
export class ExerciseProgressController {
  constructor(private readonly getProgress: GetExerciseProgress) {}

  @Get(':id/progress')
  get(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.getProgress.execute(id, user.id);
  }
}