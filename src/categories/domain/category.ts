export interface Category {
  readonly id: number;
  readonly key: string | null;
  readonly userId: string | null;
  readonly name: string;
  readonly color: string;
  readonly sortOrder: number;
}