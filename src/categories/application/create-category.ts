import { Injectable } from '@nestjs/common';
import { Category } from '../domain/category';
import { CategoryRepository } from './category-repository';

export interface CreateCategoryInput {
  userId: string;
  name: string;
  color: string;
}

@Injectable()
export class CreateCategory {
  constructor(private readonly categories: CategoryRepository) {}

  execute(input: CreateCategoryInput): Promise<Category> {
    return this.categories.create({ userId: input.userId, name: input.name, color: input.color });
  }
}