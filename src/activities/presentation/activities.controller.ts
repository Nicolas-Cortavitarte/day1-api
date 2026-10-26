import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CreateActivity } from '../application/create-activity';
import { CheckActivityConflicts } from '../application/check-activity-conflicts';
import {
  CreateActivityDto,
  CheckConflictsQueryDto,
} from './create-activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly createActivity: CreateActivity, private readonly checkConflicts: CheckActivityConflicts) {}

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
}
