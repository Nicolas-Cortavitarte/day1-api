import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { ListCategories } from '../application/list-categories';
import { CreateCategory } from '../application/create-category';
import { UpdateCategory } from '../application/update-category';
import { DeleteCategory } from '../application/delete-category';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly listCategories: ListCategories,
    private readonly createCategory: CreateCategory,
    private readonly updateCategory: UpdateCategory,
    private readonly deleteCategory: DeleteCategory,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.listCategories.execute(user.id);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.createCategory.execute({ ...dto, userId: user.id });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.updateCategory.execute({ ...dto, categoryId: id, userId: user.id });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    await this.deleteCategory.execute({ categoryId: id, userId: user.id });
  }
}