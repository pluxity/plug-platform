import { DayPicker, DayButton, type CalendarDay, type Modifiers } from "react-day-picker";
import { Button } from "../Button/Button";

export type CalendarLanguage = "ko" | "en";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  mode?: "single" | "multiple" | "range";
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  language?: CalendarLanguage;
  captionLayout?: "label" | "dropdown";
  showOutsideDays?: boolean;
  className?: string;
}

export interface CalendarDayButtonProps extends React.ComponentProps<typeof DayButton> {
  className?: string;
  day: CalendarDay;
  modifiers: Modifiers;
}
