export interface Exercise {
  readonly id: string;
  readonly userId: string | null;
  readonly name: string;
  readonly muscleGroup: string | null;
}