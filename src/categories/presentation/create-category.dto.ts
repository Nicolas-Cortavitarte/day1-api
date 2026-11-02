import { IsString, Matches, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString() @MaxLength(50) name: string;
  @Matches(/^#[0-9A-Fa-f]{6}$/) color: string;
}