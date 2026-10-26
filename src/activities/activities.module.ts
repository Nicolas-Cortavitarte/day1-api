import { Module } from '@nestjs/common';
import { ActivityRepository } from './application/activity-repository';
import { CreateActivity } from './application/create-activity';
import { PrismaActivityRepository } from './infrastructure/prisma-activity-repository';
import { ActivitiesController } from './presentation/activities.controller';
import { CheckActivityConflicts } from './application/check-activity-conflicts';
import { ListActivitiesByDate } from './application/list-activities-by-date';

@Module({
  controllers: [ActivitiesController],
  providers: [
    { provide: ActivityRepository, useClass: PrismaActivityRepository },
    CreateActivity, CheckActivityConflicts, ListActivitiesByDate
  ],
})
export class ActivitiesModule {}