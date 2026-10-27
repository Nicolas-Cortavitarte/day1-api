import { Injectable } from '@nestjs/common';
import { Category } from '../domain/category';
import { CategoryRepository } from './category-repository';

@Injectable()
export class ListCategories {
  constructor(private readonly categories: CategoryRepository) {}

  execute(): Promise<Category[]> {
    return this.categories.findAll();
  }
}