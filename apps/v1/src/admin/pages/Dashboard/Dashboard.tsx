import { Sidebar } from '@plug/ui';
import { Outlet } from 'react-router-dom';
import { DashboardTitle } from './utils/useDashboardTitle'; 

const Dashboard = () => {
    const title = DashboardTitle();

    return (
        <div className='h-screen w-full flex flex-col overflow-hidden'>
            <div className='flex flex-1 overflow-hidden'>
                <Sidebar className='h-full'>
                    <Sidebar.Menu
                        items={[
                            {
                                title: 'ASSET 관리',
                                link: '/admin/dashboard/asset/management',
                                toggleable: false,
                            },
                            {
                                title: '호선 관리',
                                link: '/admin/dashboard/line/management',
                                toggleable: false,
                            },
                            {
                                title: '디바이스 관리',
                                submenu: [
                                    {
                                        title: '디바이스 관리',
                                        link: '/admin/dashboard/device/management'
                                    },
                                    {
                                        title: '디바이스 카테고리 관리',
                                        link: '/admin/dashboard/device/category'
                                    }
                                ]
                            },
                            {
                                title: '사용자 관리',
                                link: '/admin/dashboard/user/management',
                                toggleable: false,
                            },
                            {
                                title: '역사 관리',
                                link: '/admin/dashboard/facility',
                            }
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