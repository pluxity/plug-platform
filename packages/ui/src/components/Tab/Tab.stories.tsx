import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from '../Tab';
import type { TabProps } from './Tab.types';

const meta: Meta<typeof Tab> = {
    title: 'Components/Tab',
    component: Tab,
    tags: ['autodocs'],
}

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
    render: (args: TabProps) => (
        <Tab {...args} className="w-100" defaultValue="tab1">
            <Tab.List>
                <Tab.Trigger value="tab1">첫번째 탭</Tab.Trigger>
                <Tab.Trigger value="tab2">두번째 탭</Tab.Trigger>
            </Tab.List>
            <Tab.Content value="tab1">첫번째 콘텐츠 영역</Tab.Content>
            <Tab.Content value="tab2">두번째 콘텐츠 영역</Tab.Content>
        </Tab>
    ),
    args:{

    }
}