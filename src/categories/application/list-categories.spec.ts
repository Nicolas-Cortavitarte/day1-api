import { Category } from '../domain/category';
import { CategoryRepository } from './category-repository';
import { ListCategories } from './list-categories';

class FakeRepository extends CategoryRepository {
  constructor(private categories: Category[]) { super(); }
  async findAll(): Promise<Category[]> {
    return this.categories;
  }
}

describe('ListCategories', () => {
  it('devuelve las categorías del repositorio', async () => {
    const categories = [{ id: 1, key: 'study', name: 'Estudio', color: '#B7D9BD', sortOrder: 1 }];
    const result = await new ListCategories(new FakeRepository(categories)).execute();
    expect(result).toEqual(categories);
  });
});