import { Controller, Get } from '@nestjs/common';
import { ListCategories } from '../application/list-categories';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly listCategories: ListCategories) {}

  @Get()
  list() {
    return this.listCategories.execute();
  }
}