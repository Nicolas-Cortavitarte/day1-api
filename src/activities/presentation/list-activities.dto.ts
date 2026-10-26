import { IsISO8601 } from 'class-validator';

export class ListActivitiesQueryDto {
  @IsISO8601({ strict: true }) date: string;
}