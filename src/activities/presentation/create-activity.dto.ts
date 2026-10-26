import { Transform } from 'class-transformer';
import { IsISO8601, IsInt, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min } from 'class-validator';

export class CreateActivityDto {
  @IsInt() @Min(1) categoryId: number;
  @IsString() @MaxLength(120) title: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsISO8601({ strict: true }) scheduledDate: string; 
  @IsOptional() @Matches(/^\d{2}:\d{2}(:\d{2})?$/) startTime?: string;
  @IsOptional() @IsInt() @Min(1) @Max(1440) durationMinutes?: number;
}

export class CheckConflictsQueryDto {
  @IsISO8601({ strict: true }) date: string;
  @IsOptional() @Matches(/^\d{2}:\d{2}(:\d{2})?$/) startTime?: string;
  @IsOptional() @Transform(({ value }) => Number(value)) @IsInt() @Min(1) @Max(1440) durationMinutes?: number;
  @IsOptional() @IsUUID() excludeActivityId?: string;
}