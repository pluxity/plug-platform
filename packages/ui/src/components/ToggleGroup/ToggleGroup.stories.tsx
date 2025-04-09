import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup } from '../ToggleGroup';

const meta: Meta<typeof ToggleGroup> = {
    title: 'Components/Toggle',
    component: ToggleGroup,
    tags: ['autodocs'],
    argTypes:{
    }

}

export default meta;

type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
    render:(args) => (
        <ToggleGroup {...args}>
            <ToggleGroupItems>1</ToggleGroupItems>
            <ToggleGroupItems>2</ToggleGroupItems>
            <ToggleGroupItems>3</ToggleGroupItems>
        </ToggleGroup>
    )
}
