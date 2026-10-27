import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PreferencesUpdate, UserPreferencesRepository } from '../application/user-preferences-repository';
import { UserPreferences } from '../domain/user-preferences';

@Injectable()
export class PrismaUserPreferencesRepository extends UserPreferencesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByUserId(userId: string): Promise<UserPreferences> {
    const row = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!row) throw new NotFoundException('Usuario no encontrado');
    return toDomain(row);
  }

  async update(userId: string, changes: PreferencesUpdate): Promise<UserPreferences> {
    const row = await this.prisma.user.update({ where: { id: userId }, data: toPrismaData(changes) });
    return toDomain(row);
  }
}

function toDomain(row: {
  timezone: string; locale: string; weekStartsOn: number; preferredWeightUnit: string;
  notificationsEnabled: boolean; defaultReminderMinutes: number | null; dailySummaryTime: Date | null;
}): UserPreferences {
  return {
    timezone: row.timezone,
    locale: row.locale,
    weekStartsOn: row.weekStartsOn,
    preferredWeightUnit: row.preferredWeightUnit as UserPreferences['preferredWeightUnit'],
    notificationsEnabled: row.notificationsEnabled,
    defaultReminderMinutes: row.defaultReminderMinutes,
    dailySummaryTime: row.dailySummaryTime ? row.dailySummaryTime.toISOString().slice(11, 19) : null,
  };
}

function toPrismaData(changes: PreferencesUpdate) {
  return {
    ...changes,
    dailySummaryTime: changes.dailySummaryTime !== undefined
      ? (changes.dailySummaryTime ? new Date(`1970-01-01T${changes.dailySummaryTime}Z`) : null)
      : undefined,
  };
}