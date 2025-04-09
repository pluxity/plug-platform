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
            <ToggleGroup.Item>1</ToggleGroup.Item>
            <ToggleGroup.Item>2</ToggleGroup.Item>
            <ToggleGroup.Item>3</ToggleGroup.Item>
        </ToggleGroup>
    )
}
