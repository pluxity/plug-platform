import type { DayPickerProps, DateRange } from 'react-day-picker';

export interface CalendarProps extends Omit<DayPickerProps, 'className'> {
    className?: string;
    mode?: 'single' | 'multiple' | 'range';
    onChange?: (value: Date | Date[] | DateRange | undefined) => void;
}