import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
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
import { SetActivityCompletion } from '../application/set-activity-completion';
import { DeleteActivity } from '../application/delete-activity';
import { RescheduleActivity } from '../application/reschedule-activity';
import { RescheduleActivityDto } from './reschedule-activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly createActivity: CreateActivity,
    private readonly checkConflicts: CheckActivityConflicts,
    private readonly listActivities: ListActivitiesByDate,
    private readonly setCompletion: SetActivityCompletion,
    private readonly deleteActivity: DeleteActivity,
    private readonly rescheduleActivity: RescheduleActivity,
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
  list(
    @Query() query: ListActivitiesQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.listActivities.execute({
      userId: user.id,
      scheduledDate: query.date,
    });
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.setCompletion.execute({
      activityId: id,
      userId: user.id,
      completed: true,
    });
  }

  @Patch(':id/uncomplete')
  uncomplete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.setCompletion.execute({
      activityId: id,
      userId: user.id,
      completed: false,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.deleteActivity.execute({ activityId: id, userId: user.id });
  }

  @Patch(':id/reschedule')
  reschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleActivityDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.rescheduleActivity.execute({
      activityId: id,
      userId: user.id,
      toDate: dto.toDate,
      toTime: dto.toTime ?? null,
    });
  }
}
