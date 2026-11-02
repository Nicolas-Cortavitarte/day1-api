import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfileUpdate, UserProfileRepository } from '../application/user-profile-repository';
import { UserProfile } from '../domain/user-profile';

@Injectable()
export class PrismaUserProfileRepository extends UserProfileRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByUserId(userId: string): Promise<UserProfile> {
    const row = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!row) throw new NotFoundException('Usuario no encontrado');
    return { id: row.id, email: row.email, displayName: row.displayName, avatarUrl: row.avatarUrl };
  }

  async update(userId: string, changes: ProfileUpdate): Promise<UserProfile> {
    const row = await this.prisma.user.update({ where: { id: userId }, data: changes });
    return { id: row.id, email: row.email, displayName: row.displayName, avatarUrl: row.avatarUrl };
  }
}