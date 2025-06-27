import type { Meta, StoryObj } from '@storybook/react';
import { LabeledInput } from "./LabeledInput";
import { useState } from "react";

const meta: Meta<typeof LabeledInput> = {
  title: 'MOLECULE/LabeledInput',
  component: LabeledInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'onChange' },
    label: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'boolean' },
  },
}

export default meta;
type Story = StoryObj<typeof LabeledInput>;

export const Default: Story = {
    render: function Render(args) {
        const [value, setValue] = useState("");
        const [isValid, setIsValid] = useState(true);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            setValue(inputValue);
            setIsValid(inputValue.length >= 5);
        };
    
        return(
            <>
                <LabeledInput 
                    {...args}
                    label="라벨명"
                    value={value}
                    placeholder="입력하세요"
                    error={!isValid && value !== ""}
                    onChange={handleChange}
                />
                {!isValid && value !== "" && (
                    <p className="text-xs text-red-700">사용자 이름은 5자 이상이어야 합니다.</p>
                )}
            </>
        )
    }
}

export const MultipleInputs: Story = {
    render: function Render() {
        const [value, setValue] = useState("");
        const [secondValue, setSecondValue] = useState("");

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            setValue(inputValue);
        };

        const secondHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            setSecondValue(inputValue);
        };
    
        return(
            <div className="flex flex-col gap-3">
                <LabeledInput 
                    label="라벨명"
                    value={value}
                    placeholder="입력하세요"
                    onChange={handleChange}
                />

                <LabeledInput 
                    label="라벨명"
                    value={secondValue}
                    placeholder="입력하세요"
                    onChange={secondHandleChange}
                />
            </div>
        )
    }
}
