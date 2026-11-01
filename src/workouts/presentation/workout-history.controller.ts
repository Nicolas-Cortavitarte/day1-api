import { Controller, Get, Query } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { ListWorkoutHistory } from '../application/list-workout-history';
import { WorkoutHistoryQueryDto } from './workout-history-query.dto';

@Controller('workouts')
export class WorkoutHistoryController {
  constructor(private readonly listHistory: ListWorkoutHistory) {}

  @Get('history')
  list(@Query() query: WorkoutHistoryQueryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.listHistory.execute(user.id, query.limit ? Number(query.limit) : undefined);
  }
}