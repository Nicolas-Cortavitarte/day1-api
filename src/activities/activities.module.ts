import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { ActivityRepository } from './application/activity-repository';
import { ActivityRecurrenceRepository } from './application/activity-recurrence-repository';
import { CheckActivityConflicts } from './application/check-activity-conflicts';
import { CreateActivity } from './application/create-activity';
import { CreateActivityRecurrence } from './application/create-activity-recurrence';
import { DeleteActivity } from './application/delete-activity';
import { GetActivity } from './application/get-activity';
import { ListActivitiesByDate } from './application/list-activities-by-date';
import { RescheduleActivity } from './application/reschedule-activity';
import { SetActivityCompletion } from './application/set-activity-completion';
import { PrismaActivityRepository } from './infrastructure/prisma-activity-repository';
import { PrismaActivityRecurrenceRepository } from './infrastructure/prisma-activity-recurrence-repository';
import { ActivityRecurrencesController } from './infrastructure/activity-recurrences.controller';
import { ActivitiesController } from './presentation/activities.controller';

@Module({
  imports: [CategoriesModule],
  controllers: [ActivitiesController, ActivityRecurrencesController],
  providers: [
    { provide: ActivityRepository, useClass: PrismaActivityRepository },
    { provide: ActivityRecurrenceRepository, useClass: PrismaActivityRecurrenceRepository },
    CreateActivity,
    CheckActivityConflicts,
    ListActivitiesByDate,
    SetActivityCompletion,
    DeleteActivity,
    RescheduleActivity,
    GetActivity,
    CreateActivityRecurrence,
  ],
  exports: [ActivityRepository],
})
export class ActivitiesModule {}