export type WeightUnit = 'KG' | 'LB';
export type ThemePreference = 'LIGHT' | 'DARK' | 'SYSTEM';
export type FontScale = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface UserPreferences {
  readonly timezone: string;
  readonly locale: string;
  readonly weekStartsOn: number;
  readonly preferredWeightUnit: WeightUnit;
  readonly notificationsEnabled: boolean;
  readonly defaultReminderMinutes: number | null;
  readonly dailySummaryTime: string | null;
  readonly theme: ThemePreference;
  readonly fontScale: FontScale;
}