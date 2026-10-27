import { Body, Controller, Post } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { CreateActivityRecurrence } from '../application/create-activity-recurrence';
import { CreateActivityRecurrenceDto } from './create-activity-recurrence.dto';

@Controller('activity-recurrences')
export class ActivityRecurrencesController {
  constructor(private readonly createRecurrence: CreateActivityRecurrence) {}

  @Post()
  create(@Body() dto: CreateActivityRecurrenceDto, @CurrentUser() user: AuthenticatedUser) {
    return this.createRecurrence.execute({ ...dto, userId: user.id });
  }
}