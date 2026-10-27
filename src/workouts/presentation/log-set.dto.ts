import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class LogSetDto {
  @IsOptional() @IsInt() @Min(1) reps?: number;
  @IsOptional() @IsNumber() @Min(0) weightValue?: number;
  @IsOptional() @IsIn(['KG', 'LB']) weightUnit?: 'KG' | 'LB';
  @IsOptional() @IsInt() @Min(1) durationSeconds?: number;
  @IsOptional() @IsBoolean() completed?: boolean;
}