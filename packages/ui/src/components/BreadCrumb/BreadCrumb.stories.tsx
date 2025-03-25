import type { Meta, StoryObj } from '@storybook/react';
import { BreadCrumb } from '../BreadCrumb';
import HomeIcon from "../../assets/icons/home.svg";

const meta: Meta<typeof BreadCrumb> = {
    title: 'Components/BreadCrumb',
    component: BreadCrumb,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'medium', 'large']
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary']
        }
    }
};

export default meta;
type Story = StoryObj<typeof BreadCrumb>;

export const Default: Story = {
    render: (args) => {
        return (
            <BreadCrumb {...args} >
                <BreadCrumb.Item >
                    <BreadCrumb.Link href="Home">Home</BreadCrumb.Link>
                </BreadCrumb.Item>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href="BreadCrumb">BreadCrumb</BreadCrumb.Link>
                </BreadCrumb.Item>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href="Component">Component</BreadCrumb.Link>
                </BreadCrumb.Item>
            </BreadCrumb>
        );
    },
    args: {
        size: 'small',
        color: 'primary',
        separator: 'line',
    }
};

export const Size: Story = {
    render: (args) => {
        return (
            <>
                <strong>small : </strong>
                <BreadCrumb {...args} size='small'>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Home'>
                            <HomeIcon /> Home
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='BreadCrumb'>
                            <HomeIcon /> BreadCrumb
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Component'>
                            Component
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
                <strong>medium : </strong>
                <BreadCrumb {...args} size='medium'>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href='Home'>
                        <HomeIcon /> Home
                    </BreadCrumb.Link>
                </BreadCrumb.Item>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href='BreadCrumb'>
                        <HomeIcon /> BreadCrumb
                    </BreadCrumb.Link>
                </BreadCrumb.Item>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href='Component'>
                        Component
                    </BreadCrumb.Link>
                </BreadCrumb.Item>
                </BreadCrumb>
                <strong>large : </strong>
                <BreadCrumb {...args} size='large'>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Home'>
                            <HomeIcon /> Home
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='BreadCrumb'>
                            <HomeIcon /> BreadCrumb
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Component'>
                            Component
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
            </> 
        );
    },
};

export const color: Story = {
    render: (args) => {
        return (
            <>
                <strong>primary : </strong>
                <BreadCrumb {...args} color='primary'>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Home'>
                            <HomeIcon /> Home
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='BreadCrumb'>
                            <HomeIcon /> BreadCrumb
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Component'>
                            Component
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
                <strong>secondary : </strong>
                <BreadCrumb {...args} color='secondary'>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Home'>
                            <HomeIcon /> Home
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='BreadCrumb'>
                            <HomeIcon /> BreadCrumb
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Component'>
                            Component
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
            </>
        );
    }
};

export const separator: Story = {
    render: (args) => {
        return (
            <>
                <strong>line : </strong>
                <BreadCrumb {...args} separator='line'>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Home'>
                            <HomeIcon /> Home
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='BreadCrumb'>
                            <HomeIcon /> BreadCrumb
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Component'>
                            Component
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
                <strong>arrow : </strong>
                <BreadCrumb {...args} separator='arrow'>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Home'>
                            <HomeIcon /> Home
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='BreadCrumb'>
                            <HomeIcon /> BreadCrumb
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                    <BreadCrumb.Item>
                        <BreadCrumb.Link href='Component'>
                            Component
                        </BreadCrumb.Link>
                    </BreadCrumb.Item>
                </BreadCrumb>
            </>
        );
    }
};

export const WithIcon: Story = {
    render: (args) => {
        return (
            <BreadCrumb {...args}>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href='Home'>
                        <HomeIcon /> Home
                    </BreadCrumb.Link>
                </BreadCrumb.Item>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href='BreadCrumb'>
                        <HomeIcon /> BreadCrumb
                    </BreadCrumb.Link>
                </BreadCrumb.Item>
                <BreadCrumb.Item>
                    <BreadCrumb.Link href='Component'>
                        Component
                    </BreadCrumb.Link>
                </BreadCrumb.Item>
            </BreadCrumb>
        );
    }
};