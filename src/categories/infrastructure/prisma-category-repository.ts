import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryRepository, CategoryUpdate, NewCategory } from '../application/category-repository';
import { Category } from '../domain/category';

@Injectable()
export class PrismaCategoryRepository extends CategoryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAvailableFor(userId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { deletedAt: null, OR: [{ userId: null }, { userId }] },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByKey(key: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { key } });
  }

  async findById(id: number): Promise<Category | null> {
    return this.prisma.category.findFirst({ where: { id, deletedAt: null } });
  }

  async create(category: NewCategory): Promise<Category> {
    return this.prisma.category.create({ data: { ...category, sortOrder: 999 } });
  }

  async update(id: number, changes: CategoryUpdate): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data: changes });
  }

  async softDelete(id: number): Promise<void> {
    await this.prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}