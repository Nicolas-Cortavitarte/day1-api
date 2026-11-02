import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserAccountRepository } from '../application/user-account-repository';

@Injectable()
export class PrismaUserAccountRepository extends UserAccountRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async softDeleteAllData(userId: string): Promise<void> {
    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.activity.updateMany({ where: { userId, deletedAt: null }, data: { deletedAt: now } }),
      this.prisma.activityRecurrence.updateMany({ where: { userId, deletedAt: null }, data: { deletedAt: now } }),
      this.prisma.exercise.updateMany({ where: { userId, deletedAt: null }, data: { deletedAt: now } }),
      this.prisma.category.updateMany({ where: { userId, deletedAt: null }, data: { deletedAt: now } }),
      this.prisma.user.update({ where: { id: userId }, data: { deletedAt: now } }),
    ]);
  }
}