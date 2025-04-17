import { Meta, StoryObj } from '@storybook/react';
import { HomeIcon } from '../../index.icons';
import { Sidebar } from '../Sidebar';
import { useState } from 'react';

const meta: Meta<typeof Sidebar> = {
    title: 'Components/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
    argTypes: {
        isOpen: {
            control: 'boolean',
            description: '사이드바 열림/닫힘 상태'
        }
    }
}

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    render: () => (
        <Sidebar>
            <Sidebar.Header className="rounded-sm bg-gray-100">사이드바 헤더</Sidebar.Header>
            <Sidebar.Menu>
                <Sidebar.MenuItem toggleable={false}>
                    <Sidebar.MenuButton onClick={() => location.href = "./?path=/docs/components-sidebar--docs"}>
                        <HomeIcon />
                        메뉴1
                    </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem toggleable={true}>
                    <Sidebar.MenuButton>
                        메뉴2
                    </Sidebar.MenuButton>
                    <Sidebar.SubMenu>
                        <Sidebar.SubMenuItem>
                            <a href="./?path=/docs/components-sidebar--docs">서브메뉴2-1</a>
                        </Sidebar.SubMenuItem>
                        <Sidebar.SubMenuItem>
                            <a href="./?path=/docs/components-sidebar--docs">서브메뉴2-2</a>
                        </Sidebar.SubMenuItem>
                    </Sidebar.SubMenu>
                </Sidebar.MenuItem>
            </Sidebar.Menu>
            <Sidebar.Footer className="rounded-sm bg-gray-100">사이드바 푸터</Sidebar.Footer>
        </Sidebar>
    )
}

export const NoHeaderFooter: Story = {
    render: (args) => (
        <Sidebar {...args}>
            <Sidebar.Menu>
                <Sidebar.MenuItem>
                    <Sidebar.MenuButton>
                        <HomeIcon />
                        메뉴1
                    </Sidebar.MenuButton>
                    <Sidebar.SubMenu>
                        <Sidebar.SubMenuItem>서브메뉴1</Sidebar.SubMenuItem>
                        <Sidebar.SubMenuItem>서브메뉴2</Sidebar.SubMenuItem>
                    </Sidebar.SubMenu>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                    <Sidebar.MenuButton>메뉴1</Sidebar.MenuButton>
                    <Sidebar.SubMenu>
                        <Sidebar.SubMenuItem>서브메뉴2-1</Sidebar.SubMenuItem>
                        <Sidebar.SubMenuItem>서브메뉴2-2</Sidebar.SubMenuItem>
                    </Sidebar.SubMenu>
                </Sidebar.MenuItem>
            </Sidebar.Menu>
        </Sidebar>
    )
}

export const WithTrigger: Story = {
    render: () => {
        const SidebarTrigger = () => {
            const [isVisible, setIsVisible] = useState(true);
            
            return (
                <div className="flex">
                    <Sidebar isOpen={isVisible}>
                        <Sidebar.Header className="rounded-sm bg-gray-100">사이드바 헤더</Sidebar.Header>
                        <Sidebar.Menu>
                            <Sidebar.MenuItem>
                                <Sidebar.MenuButton>
                                    <HomeIcon />
                                    메뉴1
                                </Sidebar.MenuButton>
                                <Sidebar.SubMenu>
                                    <Sidebar.SubMenuItem>서브메뉴1</Sidebar.SubMenuItem>
                                    <Sidebar.SubMenuItem>서브메뉴2</Sidebar.SubMenuItem>
                                </Sidebar.SubMenu>
                            </Sidebar.MenuItem>
                        </Sidebar.Menu>
                        <Sidebar.Footer className="rounded-sm bg-gray-100">사이드바 푸터</Sidebar.Footer>
                    </Sidebar>
                    <div className="p-4">
                        <button 
                            onClick={() => setIsVisible(!isVisible)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            {isVisible ? '사이드바 접기' : '사이드바 펼치기'}
                        </button>
                        <div className="mt-4">
                            <p>여기는 메인 콘텐츠 영역입니다.</p>
                        </div>
                    </div>
                </div>
            )
        }
        return <SidebarTrigger />
    }
}

export const Closed: Story = {
    render: (args) => (
        <Sidebar {...args} isOpen={false}>
            <Sidebar.Header className="rounded-sm bg-gray-100">사이드바 헤더
            </Sidebar.Header>
            <Sidebar.Menu>
                <Sidebar.MenuItem>
                    <Sidebar.MenuButton>
                        <HomeIcon />
                        메뉴1
                    </Sidebar.MenuButton>
                    <Sidebar.SubMenu>
                        <Sidebar.SubMenuItem>서브메뉴1</Sidebar.SubMenuItem>
                        <Sidebar.SubMenuItem>서브메뉴2</Sidebar.SubMenuItem>
                    </Sidebar.SubMenu>
                </Sidebar.MenuItem>
            </Sidebar.Menu>
            <Sidebar.Footer className="rounded-sm bg-gray-100">사이드바 푸터</Sidebar.Footer>
        </Sidebar>
    )
}