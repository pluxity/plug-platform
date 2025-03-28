import type { DayPickerProps } from 'react-day-picker';

export interface CalendarProps extends Omit<DayPickerProps, 'className'> {
    className?: string;
}