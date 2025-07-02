import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../../atom/Button/Button";
import { Calendar } from "../../atom/Calendar/Calendar";
import { useState, useEffect } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../atom/Popover/Popover";
import { DatePickerProps } from "./DatePicker.types";

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = useState<Date | undefined>(value)

  useEffect(() => {
    if (value !== undefined) setInternalDate(value)
  }, [value])

  const handleSelect = (date: Date | undefined) => {
    setInternalDate(date)
    onChange?.(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!internalDate}
          className={`data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal ${className ?? ""}`}
        >
          <CalendarIcon />
          {internalDate ? format(internalDate, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={internalDate} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  )
}

DatePicker.displayName = "DatePicker";

export { DatePicker };
