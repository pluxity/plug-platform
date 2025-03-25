import type { Meta, StoryObj } from '@storybook/react';
import { BreadCrumb } from '../BreadCrumb';
import HomeIcon from "../../assets/icons/home.svg";
import { useState } from 'react';

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
                        <BreadCrumb.Link href="Component ">Component</BreadCrumb.Link>
                    </BreadCrumb.Item>
            </BreadCrumb>
        );
    },
    args: {
        size: 'small',
        color: 'primary',
        separator: 'line',
        defaultPage: 'Home',
    }
};

export const WithIcon: Story = {
    render: (args) => {
        const [currentPage, setCurrentPage] = useState('Home');
    
        return (
            <BreadCrumb {...args} page={currentPage} onPageChange={setCurrentPage}>
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