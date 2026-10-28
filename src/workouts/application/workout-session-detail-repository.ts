import { WorkoutSessionDetail } from '../domain/workout-session-detail';

export abstract class WorkoutSessionDetailRepository {
  abstract findBySessionId(sessionId: string): Promise<WorkoutSessionDetail | null>;
}