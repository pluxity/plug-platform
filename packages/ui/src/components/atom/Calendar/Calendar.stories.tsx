import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./Calendar";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const meta: Meta<typeof Calendar> = {
    title: 'ATOM/Calendar',
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
        language: {
            control: 'select',
            options: ['ko', 'en'],
            description: '언어 설정 (한국어/영어)',
        },
    },
}

export default meta

type Story = StoryObj<typeof Calendar>

export const Defult : Story = {
    render: function Render(args) {
        return (
            <Calendar
                mode="single"
                captionLayout={args.captionLayout}
                showOutsideDays={args.showOutsideDays}
                buttonVariant={args.buttonVariant}
                language={args.language}
                className="rounded-lg border"
            />
        )
    }
}

export const MonthAndYear: Story = {
    render: function Render(args) {
        const [date, setDate] = useState<Date | undefined>(new Date())
        
        return (
            <div className="flex flex-col gap-4">
                <Calendar
                    {...args}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown"
                    language={args.language}
                    className="rounded-lg border"
                />
                <p className="text-sm text-muted-foreground">
                    선택된 날짜: {date ? date.toLocaleDateString(args.language === 'en' ? 'en-US' : 'ko-KR') : '없음'}
                </p>
            </div>
        )
    }
}

export const WithDateSelection: Story = {
    render: function Render(args) {
        const [date, setDate] = useState<Date>()
        return (
            <div className="flex flex-col gap-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    language={args.language}
                    className="rounded-lg border"
                />
                <p className="text-sm text-muted-foreground">
                    선택된 날짜: {date ? date.toLocaleDateString(args.language === 'en' ? 'en-US' : 'ko-KR') : '없음'}
                </p>
            </div>  
        )
    }
}


export const UseDateRange: Story = {
    render: function Render(args) {
        const [date, setDate] = useState<DateRange>()
        return(
            <div className="flex flex-col gap-4">
                <Calendar
                    {...args}
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    language={args.language}
                    className="rounded-lg border"
                />
                <p className="text-sm text-muted-foreground">
                    선택된 범위: {date?.from ? date.from.toLocaleDateString(args.language === 'en' ? 'en-US' : 'ko-KR') : '없음'} 
                    {date?.to ? ` ~ ${date.to.toLocaleDateString(args.language === 'en' ? 'en-US' : 'ko-KR')}` : ''}
                </p>
            </div>
        )
    }
}

export const MultipleSelection: Story = {
    render: function Render(args) {
        const [dates, setDates] = useState<Date[]>()
        return(
            <div className="flex flex-col gap-4">
                <Calendar
                    {...args}
                    mode="multiple"
                    selected={dates}
                    onSelect={setDates}
                    language={args.language}
                    className="rounded-lg border"
                />
                <p className="text-sm text-muted-foreground">
                    선택된 날짜: {dates?.length ? dates.map(d => d.toLocaleDateString(args.language === 'en' ? 'en-US' : 'ko-KR')).join(', ') : '없음'}
                </p>
            </div>
        )
    }
}

export const LanguageSwitchExample: Story = {
    render: function Render(args) {
        const [date, setDate] = useState<Date | undefined>(new Date())
        return(
            <Calendar
                {...args}
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
                language="en"
            />
        )
    }
}