import { ArrayMinSize, IsArray, IsIn, IsInt, IsISO8601, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class CreateActivityRecurrenceDto {
  @IsInt() @Min(1) categoryId: number;
  @IsString() @MaxLength(120) title: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @Matches(/^\d{2}:\d{2}(:\d{2})?$/) startTime?: string;
  @IsOptional() @IsInt() @Min(1) @Max(1440) durationMinutes?: number;
  @IsOptional() @IsInt() @Min(0) @Max(1440) reminderMinutes?: number;
  @IsIn(['DAILY', 'WEEKLY']) frequency: 'DAILY' | 'WEEKLY';
  @IsOptional() @IsInt() @Min(1) intervalCount?: number;
  @IsOptional() @IsArray() @ArrayMinSize(1) @IsInt({ each: true }) @Min(0, { each: true }) @Max(6, { each: true }) daysOfWeek?: number[];
  @IsISO8601({ strict: true }) startDate: string;
  @IsOptional() @IsISO8601({ strict: true }) endDate?: string;
}