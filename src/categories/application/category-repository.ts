import { Category } from '../domain/category';

export type NewCategory = Pick<Category, 'userId' | 'name' | 'color'>;
export type CategoryUpdate = Partial<Pick<Category, 'name' | 'color'>>;

export abstract class CategoryRepository {
  abstract findAvailableFor(userId: string): Promise<Category[]>;

  abstract findByKey(key: string): Promise<Category | null>;

  abstract findById(id: number): Promise<Category | null>;

  abstract create(category: NewCategory): Promise<Category>;

  abstract update(id: number, changes: CategoryUpdate): Promise<Category>;

  abstract softDelete(id: number): Promise<void>;
}