import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { AddExerciseToSession } from '../application/add-exercise-to-session';
import { AddExerciseToSessionDto } from './add-exercise-to-session.dto';
import { GetWorkoutSession } from '../application/get-workout-session';

@Controller('activities/:activityId/workout')
export class WorkoutsController {
  constructor(
    private readonly addExerciseToSession: AddExerciseToSession,
    private readonly getWorkoutSession: GetWorkoutSession,
  ) {}

  @Post('exercises')
  addExercise(
    @Param('activityId') activityId: string,
    @Body() dto: AddExerciseToSessionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.addExerciseToSession.execute({
      activityId,
      userId: user.id,
      exerciseId: dto.exerciseId,
      notes: dto.notes,
    });
  }

  @Get()
  get(
    @Param('activityId') activityId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.getWorkoutSession.execute({ activityId, userId: user.id });
  }
}
