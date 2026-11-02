import { Injectable } from '@nestjs/common';
import { Category } from '../domain/category';
import { CategoryRepository } from './category-repository';

@Injectable()
export class ListCategories {
  constructor(private readonly categories: CategoryRepository) {}

  execute(userId: string): Promise<Category[]> {
    return this.categories.findAvailableFor(userId);
  }
}