import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from '../Tab';
import type { TabProps } from './Tab.types';
import { useState } from "react";

const meta: Meta<typeof Tab> = {
    title: 'Components/Tab',
    component: Tab,
    tags: ['autodocs'],
    argTypes:{
        color: {
            control: 'select',
            options: ['primary', 'secondary']
        }
    }
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
}

export const ControlledTab: Story = {
    render: () => {
        const [activeTab, setActiveTab] = useState<string>('tab2');
        const tabOnChange = (value: string) => {
            setActiveTab(value);
        };
        
        return (
            <Tab className="w-100" value={activeTab} onValueChange={tabOnChange}>
                <Tab.List color="secondary" >
                    <Tab.Trigger value="tab1">첫번째 탭</Tab.Trigger>
                    <Tab.Trigger value="tab2">두번째 탭</Tab.Trigger>
                </Tab.List>
                <Tab.Content value="tab1">첫번째 콘텐츠 영역</Tab.Content>
                <Tab.Content value="tab2">두번째 콘텐츠 영역</Tab.Content>
            </Tab>
        );
    }
}