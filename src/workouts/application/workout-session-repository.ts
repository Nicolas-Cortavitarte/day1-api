import { WorkoutSession } from '../domain/workout-session';

export abstract class WorkoutSessionRepository {
  abstract findByActivityId(activityId: string): Promise<WorkoutSession | null>;

  abstract findById(id: string): Promise<WorkoutSession | null>;
}