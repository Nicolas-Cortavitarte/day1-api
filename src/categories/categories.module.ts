import { Module } from '@nestjs/common';
import { CategoryRepository } from './application/category-repository';
import { ListCategories } from './application/list-categories';
import { CreateCategory } from './application/create-category';
import { UpdateCategory } from './application/update-category';
import { DeleteCategory } from './application/delete-category';
import { PrismaCategoryRepository } from './infrastructure/prisma-category-repository';
import { CategoriesController } from './presentation/categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [
    { provide: CategoryRepository, useClass: PrismaCategoryRepository },
    ListCategories,
    CreateCategory,
    UpdateCategory,
    DeleteCategory,
  ],
  exports: [CategoryRepository],
})
export class CategoriesModule {}