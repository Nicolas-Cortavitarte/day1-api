import { Module } from '@nestjs/common';
import { ActivityRepository } from './application/activity-repository';
import { CreateActivity } from './application/create-activity';
import { PrismaActivityRepository } from './infrastructure/prisma-activity-repository';
import { ActivitiesController } from './presentation/activities.controller';

@Module({
  controllers: [ActivitiesController],
  providers: [
    { provide: ActivityRepository, useClass: PrismaActivityRepository },
    CreateActivity,
  ],
})
export class ActivitiesModule {}