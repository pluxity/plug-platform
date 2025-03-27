import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes:{
        color:{
            control: 'select',
            options: ['primary', 'secondary']
        },
        size:{
            control: 'select',
            options: ['small', 'medium', 'large']
        },
        type:{
            control: 'select',
            options: ['rectangle', 'circle']
        },
        disabled:{
            control: 'boolean',
        }
    }

}

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {
        color: "primary",
        size: "small",
        type: "rectangle",
        label: "checkbox",
    },
}

export const Colors: Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Color: primary</div>
            <Checkbox color="primary" label="색상 primary"/>

            <div className="mt-4 mb-2">Color: Secondary</div>
            <Checkbox color="secondary" label="색상 secondary"/>
        </>
    ),
}

export const Sizes: Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Size: small</div>
            <Checkbox size="small" label="small"/>

            <div className="mt-4 mb-2">Size: medium</div>
            <Checkbox size="medium" label="medium"/>

            <div className="mt-4 mb-2">Size: large</div>
            <Checkbox size="large" label="large"/>
        </>
    ),
}

export const Types: Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Type: rectangle</div>
            <Checkbox type="rectangle" label="checkbox 사각형"/>

            <div className="mt-4 mb-2">Type: circle</div>
            <Checkbox type="circle" label="checkbox 원형"/>
        </>
    ),
}

export const OnlyInput: Story = {
    render: (args) => (
        <Checkbox {...args} />
    ),
}


export const Disabled: Story = {
    render: (args) => (
        <Checkbox {...args} disabled={true} label="비활성화"/>
    ),
}