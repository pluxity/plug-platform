import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "../../atom/Button/Button"
import { Calendar } from "../../atom/Calendar/Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../atom/Popover/Popover"

const meta: Meta<typeof Calendar> = {
    title: 'Molecule/DatePicker',
    component: Calendar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],    
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date>();

        return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!date}
                  className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          )
    }
}