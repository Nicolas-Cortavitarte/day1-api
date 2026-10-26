import { Injectable } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';

export interface ListActivitiesByDateInput {
  userId: string;
  scheduledDate: string;
}

@Injectable()
export class ListActivitiesByDate {
  constructor(private readonly activities: ActivityRepository) {}

  execute(input: ListActivitiesByDateInput): Promise<Activity[]> {
    return this.activities.findByUserAndDate(input.userId, input.scheduledDate);
  }
}