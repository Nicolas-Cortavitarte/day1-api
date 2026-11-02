import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional() @IsString() @MaxLength(50) name?: string;
  @IsOptional() @Matches(/^#[0-9A-Fa-f]{6}$/) color?: string;
}