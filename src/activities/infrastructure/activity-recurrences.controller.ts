import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { CreateActivityRecurrence } from '../application/create-activity-recurrence';
import { UpdateActivityRecurrence } from '../application/update-activity-recurrence';
import { CreateActivityRecurrenceDto } from './create-activity-recurrence.dto';
import { UpdateActivityRecurrenceDto } from './update-activity-recurrence.dto';

@Controller('activity-recurrences')
export class ActivityRecurrencesController {
  constructor(
    private readonly createRecurrence: CreateActivityRecurrence,
    private readonly updateRecurrence: UpdateActivityRecurrence,
  ) {}

  @Post()
  create(@Body() dto: CreateActivityRecurrenceDto, @CurrentUser() user: AuthenticatedUser) {
    return this.createRecurrence.execute({ ...dto, userId: user.id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateActivityRecurrenceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.updateRecurrence.execute({ ...dto, recurrenceId: id, userId: user.id });
  }
}