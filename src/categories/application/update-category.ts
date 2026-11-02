import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../domain/category';
import { CategoryRepository, CategoryUpdate } from './category-repository';

export interface UpdateCategoryInput extends CategoryUpdate {
  categoryId: number;
  userId: string;
}

@Injectable()
export class UpdateCategory {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<Category> {
    const category = await this.categories.findById(input.categoryId);
    if (!category || category.userId !== input.userId) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return this.categories.update(input.categoryId, { name: input.name, color: input.color });
  }
}