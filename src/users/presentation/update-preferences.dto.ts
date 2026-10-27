import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional() @IsString() @MaxLength(64) timezone?: string;
  @IsOptional() @IsString() @MaxLength(10) locale?: string;
  @IsOptional() @IsInt() @Min(0) @Max(6) weekStartsOn?: number;
  @IsOptional() @IsIn(['KG', 'LB']) preferredWeightUnit?: 'KG' | 'LB';
  @IsOptional() @IsBoolean() notificationsEnabled?: boolean;
  @IsOptional() @IsInt() @Min(0) @Max(1440) defaultReminderMinutes?: number;
  @IsOptional() @Matches(/^\d{2}:\d{2}(:\d{2})?$/) dailySummaryTime?: string;
}