import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CreateActivity } from '../application/create-activity';
import { CheckActivityConflicts } from '../application/check-activity-conflicts';
import {
  CreateActivityDto,
  CheckConflictsQueryDto,
} from './create-activity.dto';
import { ListActivitiesByDate } from '../application/list-activities-by-date';
import { ListActivitiesQueryDto } from './list-activities.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly createActivity: CreateActivity, 
              private readonly checkConflicts: CheckActivityConflicts,
              private readonly listActivities: ListActivitiesByDate,
  ) {}

  @Post()
  create(
    @Body() dto: CreateActivityDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createActivity.execute({ ...dto, userId: user.id });
  }

  @Get('conflicts')
  conflicts(
    @Query() query: CheckConflictsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.checkConflicts.execute({
      userId: user.id,
      scheduledDate: query.date,
      startTime: query.startTime ?? null,
      durationMinutes: query.durationMinutes ?? null,
      excludeActivityId: query.excludeActivityId,
    });
  }

  @Get()
  list(@Query() query: ListActivitiesQueryDto, @CurrentUser() user: AuthenticatedUser) {
  return this.listActivities.execute({ userId: user.id, scheduledDate: query.date });
  }
}
