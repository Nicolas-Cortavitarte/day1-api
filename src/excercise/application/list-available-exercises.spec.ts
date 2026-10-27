import { Exercise } from '../domain/exercise';
import { ExerciseRepository } from './exercise-repository';
import { ListAvailableExercises } from './list-available-exercises';

class FakeRepository extends ExerciseRepository {
  constructor(private exercises: Exercise[]) { super(); }
  async findAvailableFor(userId: string): Promise<Exercise[]> {
    return this.exercises.filter((e) => e.userId === null || e.userId === userId);
  }
  create(): Promise<Exercise> { throw new Error('no usado'); }
}

const make = (over: Partial<Exercise>): Exercise => ({ id: 'e1', userId: null, name: 'Sentadilla', muscleGroup: 'piernas', ...over });

describe('ListAvailableExercises', () => {
  it('incluye los del sistema y los propios, no los de otro usuario', async () => {
    const repo = new FakeRepository([
      make({ id: 'sys', userId: null }),
      make({ id: 'mine', userId: 'u1' }),
      make({ id: 'other', userId: 'u2' }),
    ]);
    const result = await new ListAvailableExercises(repo).execute('u1');
    expect(result.map((e) => e.id).sort()).toEqual(['mine', 'sys']);
  });
});