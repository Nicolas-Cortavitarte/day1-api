import { Category } from '../domain/category';
import { CategoryRepository, CategoryUpdate } from './category-repository';
import { UpdateCategory } from './update-category';

class FakeRepository extends CategoryRepository {
  constructor(private categories: Category[]) { super(); }
  findAvailableFor(): Promise<Category[]> { throw new Error('no usado'); }
  findByKey(): Promise<Category | null> { throw new Error('no usado'); }
  async findById(id: number): Promise<Category | null> {
    return this.categories.find((c) => c.id === id) ?? null;
  }
  async update(id: number, changes: CategoryUpdate): Promise<Category> {
    const category = this.categories.find((c) => c.id === id)!;
    return { ...category, ...changes };
  }
  softDelete(): Promise<void> { throw new Error('no usado'); }
  create(): Promise<Category> { throw new Error('no usado'); }
}

const make = (over: Partial<Category>): Category => ({
  id: 1, key: null, userId: 'u1', name: 'Mi categoría', color: '#AABBCC', sortOrder: 999, ...over,
});

describe('UpdateCategory', () => {
  it('rechaza editar una categoría del sistema (userId null)', async () => {
    const repo = new FakeRepository([make({ userId: null })]);
    await expect(
      new UpdateCategory(repo).execute({ categoryId: 1, userId: 'u1', name: 'Hackeada' }),
    ).rejects.toThrow('Categoría no encontrada');
  });

  it('rechaza editar la categoría de otro usuario', async () => {
    const repo = new FakeRepository([make({ userId: 'u2' })]);
    await expect(
      new UpdateCategory(repo).execute({ categoryId: 1, userId: 'u1', name: 'Hackeada' }),
    ).rejects.toThrow('Categoría no encontrada');
  });

  it('permite editar la propia categoría', async () => {
    const repo = new FakeRepository([make({ userId: 'u1' })]);
    const result = await new UpdateCategory(repo).execute({ categoryId: 1, userId: 'u1', name: 'Nuevo nombre' });
    expect(result.name).toBe('Nuevo nombre');
  });
});