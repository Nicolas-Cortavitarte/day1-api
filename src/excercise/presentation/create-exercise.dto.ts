import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExerciseDto {
  @IsString() @MaxLength(100) name: string;
  @IsOptional() @IsString() @MaxLength(40) muscleGroup?: string;
}