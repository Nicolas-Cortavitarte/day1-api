import { Exercise } from '../domain/exercise';
import { ExerciseRepository, NewExercise } from './exercise-repository';
import { CreateExercise } from './create-exercise';

class FakeRepository extends ExerciseRepository {
  findAvailableFor(): Promise<Exercise[]> { throw new Error('no usado'); }
  async create(exercise: NewExercise): Promise<Exercise> {
    return { id: 'e1', ...exercise };
  }
}

describe('CreateExercise', () => {
  it('crea el ejercicio con el userId de quien lo pide', async () => {
    const result = await new CreateExercise(new FakeRepository()).execute({ userId: 'u1', name: 'Press banca' });
    expect(result).toEqual({ id: 'e1', userId: 'u1', name: 'Press banca', muscleGroup: null });
  });
});