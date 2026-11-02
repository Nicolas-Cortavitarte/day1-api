import { Category } from '../domain/category';
import { CategoryRepository } from './category-repository';
import { ListCategories } from './list-categories';

class FakeRepository extends CategoryRepository {
  constructor(private categories: Category[]) { super(); }
  async findAvailableFor(): Promise<Category[]> { return this.categories; }
  findByKey(): Promise<Category | null> { throw new Error('no usado'); }
  findById(): Promise<Category | null> { throw new Error('no usado'); }
  create(): Promise<Category> { throw new Error('no usado'); }
  update(): Promise<Category> { throw new Error('no usado'); }
  softDelete(): Promise<void> { throw new Error('no usado'); }
}

const make = (over: Partial<Category>): Category => ({
  id: 1, key: 'study', userId: null, name: 'Estudio', color: '#B7D9BD', sortOrder: 1, ...over,
});

describe('ListCategories', () => {
  it('devuelve las categorías disponibles para el usuario', async () => {
    const categories = [make({})];
    const result = await new ListCategories(new FakeRepository(categories)).execute('u1');
    expect(result).toEqual(categories);
  });
});