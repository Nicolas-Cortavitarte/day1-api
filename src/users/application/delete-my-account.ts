import { Injectable } from '@nestjs/common';
import { UserAccountRepository } from './user-account-repository';

export interface DeleteAccountInput {
  id: string;
}

@Injectable()
export class DeleteMyAccount {
  constructor(private readonly account: UserAccountRepository) {}

  execute(userId: string): Promise<void> {
    return this.account.softDeleteAllData(userId);
  }
}
