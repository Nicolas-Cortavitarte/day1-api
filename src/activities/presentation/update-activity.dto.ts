import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateActivityDto {
  @IsOptional() @IsInt() @Min(1) categoryId?: number;
  @IsOptional() @IsString() @MaxLength(120) title?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsInt() @Min(1) @Max(1440) durationMinutes?: number;
}