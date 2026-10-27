import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryRepository } from '../application/category-repository';
import { Category } from '../domain/category';

@Injectable()
export class PrismaCategoryRepository extends CategoryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<Category[]> {
    const rows = await this.prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    return rows;
  }
}