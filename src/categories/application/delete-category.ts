import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category-repository';

export interface DeleteCategoryInput {
  categoryId: number;
  userId: string;
}

@Injectable()
export class DeleteCategory {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<void> {
    const category = await this.categories.findById(input.categoryId);
    if (!category || category.userId !== input.userId) {
      throw new NotFoundException('Categoría no encontrada');
    }
    await this.categories.softDelete(input.categoryId);
  }
}