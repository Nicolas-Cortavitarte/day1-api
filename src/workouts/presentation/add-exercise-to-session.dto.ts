import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class AddExerciseToSessionDto {
  @IsUUID() exerciseId: string;
  @IsOptional() @IsString() @MaxLength(500) notes?: string;
}