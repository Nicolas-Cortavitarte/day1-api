import { Category } from '../domain/category';

export abstract class CategoryRepository {
  abstract findAll(): Promise<Category[]>;

  abstract findByKey(key: string): Promise<Category | null>;
}