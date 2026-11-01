import { IsNumberString, IsOptional } from 'class-validator';

export class WorkoutHistoryQueryDto {
  @IsOptional() @IsNumberString() limit?: string;
}