export const DEVICE_PERIOD_PRESETS: Record<'day' | 'week' | 'month', { days: number; interval: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' }> = {
  day: { days: 30, interval: 'DAY' },
  week: { days: 84, interval: 'WEEK' },
  month: { days: 365, interval: 'MONTH' }
}
