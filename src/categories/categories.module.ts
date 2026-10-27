import { Module } from '@nestjs/common';
import { CategoryRepository } from './application/category-repository';
import { ListCategories } from './application/list-categories';
import { PrismaCategoryRepository } from './infrastructure/prisma-category-repository';
import { CategoriesController } from './presentation/categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [
    { provide: CategoryRepository, useClass: PrismaCategoryRepository },
    ListCategories,
  ],
})
export class CategoriesModule {}