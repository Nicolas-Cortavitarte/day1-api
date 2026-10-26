import { IsISO8601, IsOptional, Matches } from 'class-validator';

export class RescheduleActivityDto {
  @IsISO8601({ strict: true }) toDate: string;
  @IsOptional() @Matches(/^\d{2}:\d{2}(:\d{2})?$/) toTime?: string;
}