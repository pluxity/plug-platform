import { Button } from '@plug/ui';
import { Outlet } from 'react-router-dom';


const AdminLayout = () => {

    return (
        <>
            <div className='h-screen flex flex-col overflow-hidden'>
                <header className='h-12 flex items-center py-2 px-3 bg-blue-400'>
                    <h1>Dashboard Image Area</h1>
                    <div className='flex items-center ml-auto gap-4 text-white'>
                        <span className="whitespace-nowrap">Admin 접속 중</span>
                        <Button>로그아웃</Button>
                    </div>
                </header>
                <main className="h-full flex-1 flex flex-row">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default AdminLayout;