import { cn } from '../../utils/classname';
import { DayPicker, DateRange } from 'react-day-picker';
import classNames from "react-day-picker/style.module.css";
import { useState } from 'react';
import type { CalendarProps } from './Calendar.types';

const Calendar = ({
    mode = "single",
    onChange,
    className,
    ...props
}: CalendarProps) => {
    const [selected, setSelected] = useState<Date | Date[] | DateRange | undefined>();

    const handleSelect = (date: Date | Date[] | DateRange | undefined) => {
        setSelected(date); 
        if (onChange) {     
            onChange(date);  
        }
    };
      
    const CalenderStyle = "inline-flex p-3 rounded-md shadow-[0_1px_30px_2px_rgba(0,0,0,0.1)]";
    const CalenderDayPicker = {
        month_grid: cn(classNames.month_grid, "w-full table-fixed"),
        // 캘린더 상단 : 월별, 연도별 영역
        month_caption: cn(classNames.month_caption, "mx-3"),
        caption_label: cn(classNames.caption_label, "!outline-none text-base"),
        chevron: cn(classNames.chevron, "!fill-gray-800"),
        nav: cn(classNames.nav, "flex gap-2"),
        button_next: cn(classNames.button_next, "!w-6 !h-6"),
        button_previous: cn(classNames.button_previous, "!w-6 !h-6"),

        // 캘린더 상단 : 요일 
        weekday: cn(classNames.weekday, "!text-sm"),

        // 캘린더 table
        day: cn(classNames.day, "hover:bg-gray-100 rounded-lg !text-center"), 
        day_button: cn(classNames.day_button, "!border-none !w-full"),
        today: cn(classNames.today, "!text-black bg-gray-100"),

        // 캘린더 table : 숨겨진 날짜
        outside: cn(classNames.outside, "!opacity-30 hover:bg-gray-300"),

        // 캘린더 날짜 disabled 스타일
        disabled: cn(classNames.disabled, "!opacity-30"),
        
        // 캘린더 날짜 selected 스타일 
        selected: cn(classNames.selected, "text-white bg-gray-800 !font-normal !text-base transform ease-out duration-100 hover:bg-gray-800"),
        range_start: cn(classNames.selected),
        range_end: cn(classNames.selected),
    }
    
    return (
        <div className={className}>
            {mode === 'single' && (
                <DayPicker
                    {...props}
                    mode="single"
                    selected={selected as Date}
                    onSelect={(date) => handleSelect(date as Date | undefined)}
                    className={CalenderStyle}
                    classNames={{
                        ...classNames,
                        ...CalenderDayPicker
                    }}
                />
            )}

            {mode === 'multiple' && (
                <DayPicker
                    {...props}
                    mode="multiple"
                    selected={selected as Date[]}
                    onSelect={(dates) => handleSelect(dates as Date[] | undefined)}
                    className={CalenderStyle}
                    classNames={{
                        ...classNames,
                        ...CalenderDayPicker
                    }}
                />
            )}

            {mode === 'range' && (
                <DayPicker
                    {...props}
                    mode="range"
                    selected={selected as DateRange}
                    onSelect={(range) => handleSelect(range as DateRange | undefined)}
                    className={CalenderStyle}
                    classNames={{
                        ...classNames,
                        ...CalenderDayPicker
                    }}
                />
            )}
        </div>
    );
}

Calendar.displayName = "Calendar"
 
export { Calendar }