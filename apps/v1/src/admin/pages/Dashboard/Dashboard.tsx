import { Button, Sidebar } from '@plug/ui';
import { Outlet } from 'react-router-dom';
import { DashboardTitle } from './hooks/useDashboardTitle'; 

const Dashboard = () => {
    const title = DashboardTitle();

    return (
        <div className='h-screen flex flex-col overflow-hidden'>
            <header className='h-12 flex items-center py-2 px-3 bg-blue-400'>
                <h1>Dashboard Image Area</h1>
                <div className='flex items-center ml-auto gap-4 text-white'>
                    <span>Admin 접속 중</span>
                    <Button>로그아웃</Button>
                </div>
            </header>
            <div className='flex flex-1 overflow-hidden'>
                <Sidebar className='h-full'>
                    <Sidebar.Menu
                        items={[
                            {
                                title: '역사 관리',
                                submenu: [
                                    {
                                        title: '역사 목록',
                                        link: '/admin/historylist',
                                    },
                                    {
                                        title: '역사 분류',
                                        link: '/admin/historycategory',
                                    },
                                ],
                            },
                            {
                                title: 'POI 관리',
                                submenu: [
                                    {
                                        title: 'POI 목록',
                                        link: '/admin/poi/poilist',
                                    },
                                    {
                                        title: 'POI 아이콘 정보',
                                        link: '/admin/poi/poiicon',
                                    },
                                ],
                            },
                            {
                                title: '사용자 관리',
                                link: '/admin/user/userlist',
                                toggleable: false,
                            },
                        ]}
                    />
                </Sidebar>
                <div className='flex-1 flex flex-col'>
                    <main className='flex-1 overflow-auto p-6'>
                        <h2 className='font-bold text-2xl mb-4'>{title}</h2>
                        <Outlet />
                    </main>
                    <footer className='py-2 px-1 border-t border-gray-200 text-xs text-center'>
                        <p>Copyright © 2025 PLUXITY.co.,Ltd. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;