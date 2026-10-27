export type WeightUnit = 'KG' | 'LB';

export interface UserPreferences {
  readonly timezone: string;
  readonly locale: string;
  readonly weekStartsOn: number;
  readonly preferredWeightUnit: WeightUnit;
  readonly notificationsEnabled: boolean;
  readonly defaultReminderMinutes: number | null;
  readonly dailySummaryTime: string | null; 
}