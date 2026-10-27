import { Category } from '../../categories/domain/category';
import { CategoryRepository } from '../../categories/application/category-repository';
import { Activity } from '../domain/activity';
import { ActivityRepository, NewActivity } from './activity-repository';
import { CreateActivity } from './create-activity';

class FakeActivityRepository extends ActivityRepository {
  public lastCreateOptions?: { createWorkoutSession: boolean };
  create(activity: NewActivity, options?: { createWorkoutSession: boolean }): Promise<Activity> {
    this.lastCreateOptions = options;
    return Promise.resolve({
      id: 'a1', ...activity, completedAt: null, createdAt: new Date(), updatedAt: new Date(),
    });
  }
  findByUserAndDate(): Promise<Activity[]> { throw new Error('no usado'); }
  findById(): Promise<Activity | null> { throw new Error('no usado'); }
  setCompletedAt(): Promise<Activity> { throw new Error('no usado'); }
  softDelete(): Promise<void> { throw new Error('no usado'); }
  reschedule(): Promise<Activity> { throw new Error('no usado'); }
}

class FakeCategoryRepository extends CategoryRepository {
  constructor(private categories: Category[]) { super(); }
  findAll(): Promise<Category[]> { throw new Error('no usado'); }
  async findByKey(key: string): Promise<Category | null> {
    return this.categories.find((c) => c.key === key) ?? null;
  }
}

const gymCategory: Category = { id: 2, key: 'gym', name: 'Gimnasio', color: '#F1C8A7', sortOrder: 2 };
const studyCategory: Category = { id: 1, key: 'study', name: 'Estudio', color: '#B7D9BD', sortOrder: 1 };

const input = {
  userId: 'u1', title: 'x', scheduledDate: '2026-10-27', startTime: null, durationMinutes: null,
};

describe('CreateActivity', () => {
  it('crea workout_session cuando la categoría es gimnasio', async () => {
    const activities = new FakeActivityRepository();
    await new CreateActivity(activities, new FakeCategoryRepository([gymCategory, studyCategory]))
      .execute({ ...input, categoryId: gymCategory.id });
    expect(activities.lastCreateOptions).toEqual({ createWorkoutSession: true });
  });

  it('no crea workout_session para otras categorías', async () => {
    const activities = new FakeActivityRepository();
    await new CreateActivity(activities, new FakeCategoryRepository([gymCategory, studyCategory]))
      .execute({ ...input, categoryId: studyCategory.id });
    expect(activities.lastCreateOptions).toEqual({ createWorkoutSession: false });
  });
});