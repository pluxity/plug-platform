import type { Meta, StoryObj } from "@storybook/react"
import { Calendar } from "./Calendar"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

const meta: Meta<typeof Calendar> = {
    title: 'Design System/Calendar',
    component: Calendar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        mode: {
            control: 'select',
            options: ['single', 'multiple', 'range'],
            description: '날짜 선택 모드',
        },
        captionLayout: {
            control: 'select',
            options: ['label', 'dropdown'],
            description: '캡션 레이아웃',
        },
        showOutsideDays: {
            control: 'boolean',
            description: '외부 날짜 표시 여부',
        },
    },

}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
    render: (args) => (
        <Calendar
            mode="single"
            captionLayout={args.captionLayout}
            showOutsideDays={args.showOutsideDays}
            buttonVariant={args.buttonVariant}
            className="rounded-lg border"
        />
    )
}

export const MonthAndYear: Story = {
    render: (args) => {
        const [date, setDate] = useState<Date | undefined>(new Date())
        
        return (
            <div className="flex flex-col gap-4">
                <Calendar
                    {...args}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown"
                    className="rounded-lg border"
                />
                <p className="text-sm text-muted-foreground">
                    선택된 날짜: {date ? date.toLocaleDateString() : '없음'}
                </p>
            </div>
        )
    }
}

export const WithDateSelection: Story = {
    render: (args) => {
        const [date, setDate] = useState<Date>()
        
        return (
            <div className="flex flex-col gap-4">
                <Calendar
                    {...args}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg border"
                />
                <p className="text-sm text-muted-foreground">
                    선택된 날짜: {date ? date.toLocaleDateString() : '없음'}
                </p>
            </div>
        )
    }
}

export const UseDateRange: Story = {
    render: (args) => {
        const [date, setDate] = useState<DateRange>()
        
        return (
            <div className="flex flex-col gap-4">
                <Calendar
                    {...args}
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg border"
                />
                <p className="text-sm text-muted-foreground">
                    선택된 범위: {date?.from ? date.from.toLocaleDateString() : '없음'} 
                    {date?.to ? ` ~ ${date.to.toLocaleDateString()}` : ''}
                </p>
            </div>
        )
    }
}

export const MultipleSelection: Story = {
    render: (args) => {
        const [dates, setDates] = useState<Date[]>()
        
        return (
            <div className="flex flex-col gap-4">
                <Calendar
                    {...args}
                    mode="multiple"
                    selected={dates}
                    onSelect={setDates}
                    className="rounded-lg border"
                />
                <p className="text-sm text-muted-foreground">
                    선택된 날짜: {dates?.length ? dates.map(d => d.toLocaleDateString()).join(', ') : '없음'}
                </p>
            </div>
        )
    }
}