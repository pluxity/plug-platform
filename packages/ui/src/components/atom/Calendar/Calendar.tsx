import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { ko, enUS } from "date-fns/locale";
import { cn } from "../../../utils/utils";
import { Button, buttonVariants } from "../Button/Button";
import { CalendarProps, CalendarDayButtonProps } from "./Calendar.types";
import { useEffect, useRef } from "react";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  language = "ko",
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  const locale = language === "en" ? enUS : ko
  const mergedFormatters = {
    formatMonthDropdown: (date: Date) =>
      date.toLocaleString(language === "en" ? "en-US" : "ko-KR", { month: "short" }),
    formatYearDropdown: (date: Date) =>
      date.toLocaleString(language === "en" ? "en-US" : "ko-KR", { year: "numeric" }),
    formatCaption: (date: Date) =>
      date.toLocaleString(language === "en" ? "en-US" : "ko-KR", { year: "numeric", month: "long" }),
    formatWeekdayName: (date: Date) =>
      date.toLocaleString(language === "en" ? "en-US" : "ko-KR", { weekday: "short" }),
    ...formatters,
  }

  return (
    <DayPicker     
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2.5rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        "rtl:[&_.rdp-button_next>svg]:rotate-180",
        "rtl:[&_.rdp-button_previous>svg]:rotate-180",
        className
      )}
      captionLayout={captionLayout}
      formatters={mergedFormatters}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: "icon" }),
          "bg-gray-100 aria-disabled:opacity-50 select-none rounded-full",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: "icon" }),
          "bg-gray-100 aria-disabled:opacity-50 select-none rounded-full",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-[var(--cell-size)] w-full px-[var(--cell-size)]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-[var(--cell-size)] gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-[var(--cell-size)]",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md bg-blue-point",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-blue-point", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-full data-[selected=true]:rounded-full",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[var(--cell-size)] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: CalendarDayButtonProps) {
  const defaultClassNames = getDefaultClassNames()

  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-point-blue data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:rounded-full data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-point-blue data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-point-blue data-[range-end=true]:text-primary-foreground dark:hover:text-accent-foreground hover:rounded-full focus:outline-none flex aspect-square size-auto w-full min-w-[var(--cell-size)] flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:rounded-full data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

CalendarDayButton.displayName = "CalendarDayButton"

export { Calendar, CalendarDayButton }
