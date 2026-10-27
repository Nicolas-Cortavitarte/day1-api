import { Module } from '@nestjs/common';
import { ActivityRepository } from './application/activity-repository';
import { CreateActivity } from './application/create-activity';
import { PrismaActivityRepository } from './infrastructure/prisma-activity-repository';
import { ActivitiesController } from './presentation/activities.controller';
import { CheckActivityConflicts } from './application/check-activity-conflicts';
import { ListActivitiesByDate } from './application/list-activities-by-date';
import { DeleteActivity } from './application/delete-activity';
import { CategoriesModule } from '../categories/categories.module'; 
import { ActivityRecurrencesController } from './infrastructure/activity-recurrences.controller';

@Module({
  imports:[CategoriesModule],
  controllers: [ActivitiesController, ActivityRecurrencesController],
  providers: [
    { provide: ActivityRepository, useClass: PrismaActivityRepository },
    CreateActivity, CheckActivityConflicts, ListActivitiesByDate, DeleteActivity
  ],
  exports: [ActivityRepository]
})
export class ActivitiesModule {}