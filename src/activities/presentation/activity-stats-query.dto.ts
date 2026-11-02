import { IsISO8601 } from 'class-validator';

export class ActivityStatsQueryDto {
  @IsISO8601({ strict: true }) today: string;
}