import { Exercise } from '../../exercises/domain/exercise';
import { ExerciseRepository } from '../../exercises/application/exercise-repository';
import { ExerciseProgressPoint } from '../domain/exercise-progress-point';
import { ExerciseProgressRepository } from './exercise-progress-repository';
import { GetExerciseProgress } from './get-exercise-progress';

class FakeExercises extends ExerciseRepository {
  constructor(private exercises: Exercise[]) { super(); }
  findAvailableFor(): Promise<Exercise[]> { throw new Error('no usado'); }
  create(): Promise<Exercise> { throw new Error('no usado'); }
  async findById(id: string): Promise<Exercise | null> {
    return this.exercises.find((e) => e.id === id) ?? null;
  }
}

class FakeProgress extends ExerciseProgressRepository {
  constructor(private points: ExerciseProgressPoint[]) { super(); }
  async findForExercise(): Promise<ExerciseProgressPoint[]> { return this.points; }
}

const exercise = (over: Partial<Exercise>): Exercise => ({
  id: 'ex1', userId: null, name: 'Sentadilla', muscleGroup: 'piernas', ...over,
});

describe('GetExerciseProgress', () => {
  it('lanza NotFound si el ejercicio es de otro usuario', async () => {
    const exercises = new FakeExercises([exercise({ userId: 'u2' })]);
    const useCase = new GetExerciseProgress(exercises, new FakeProgress([]));
    await expect(useCase.execute('ex1', 'u1')).rejects.toThrow('Ejercicio no encontrado');
  });

  it('devuelve la progresión para un ejercicio propio o del sistema', async () => {
    const exercises = new FakeExercises([exercise({ userId: null })]);
    const points: ExerciseProgressPoint[] = [
      { sessionId: 's1', date: '2026-10-01', bestWeightValue: 50, weightUnit: 'KG', reps: 8, durationSeconds: null },
    ];
    const useCase = new GetExerciseProgress(exercises, new FakeProgress(points));
    await expect(useCase.execute('ex1', 'u1')).resolves.toEqual(points);
  });
});