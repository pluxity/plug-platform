import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from "./SearchInput";
import { useState } from "react";

const meta: Meta<typeof SearchInput> = {
  title: 'Atom/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'onChange' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    buttonClassName: { control: 'text' },
  },
}

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
    render:(args) => {
        const [value, setValue] = useState("");

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            setValue(inputValue);
        };

        const handleSubmit = () => {
            alert(`검색어: ${value}`); 
          };
    
        return(
            <>
                <SearchInput 
                    {...args}
                    value={value}
                    placeholder="입력하세요"
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    buttonClassName="bg-secondary-500 active:bg-secondary-600 hover:bg-secondary-400"
                />
            </>
        )
    }
}


