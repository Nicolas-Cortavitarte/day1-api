import { Body, Controller, Param, Post } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { LogSet } from '../application/log-set';
import { LogSetDto } from './log-set.dto';

@Controller('workout-exercises/:sessionExerciseId/sets')
export class WorkoutSetsController {
  constructor(private readonly logSet: LogSet) {}

  @Post()
  log(
    @Param('sessionExerciseId') sessionExerciseId: string,
    @Body() dto: LogSetDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.logSet.execute({ sessionExerciseId, userId: user.id, ...dto });
  }
}