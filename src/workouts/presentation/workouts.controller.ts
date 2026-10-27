import { Body, Controller, Param, Post } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { AddExerciseToSession } from '../application/add-exercise-to-session';
import { AddExerciseToSessionDto } from './add-exercise-to-session.dto';

@Controller('activities/:activityId/workout')
export class WorkoutsController {
  constructor(private readonly addExerciseToSession: AddExerciseToSession) {}

  @Post('exercises')
  addExercise(
    @Param('activityId') activityId: string,
    @Body() dto: AddExerciseToSessionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.addExerciseToSession.execute({ activityId, userId: user.id, exerciseId: dto.exerciseId, notes: dto.notes });
  }
}