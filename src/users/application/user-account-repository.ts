export abstract class UserAccountRepository {
  abstract softDeleteAllData(userId: string): Promise<void>;
}