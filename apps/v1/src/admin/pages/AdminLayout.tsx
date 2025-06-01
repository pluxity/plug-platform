import React from 'react';
import { Button } from '@plug/ui';
import { Outlet } from 'react-router-dom';
import {useProfileStore} from "@plug/v1/auth/controller/useProfileStore";
import {logOut} from "@plug/v1/auth/api/auth";

const AdminLayout = () => {
    const user = useProfileStore((state) => state.user);

    return (
        <>
            <div className='h-screen flex flex-col overflow-hidden'>
                <header className="h-16 relative z-10 flex items-center justify-between px-6 py-2.5 bg-primary-700 backdrop-blur-sm shadow-md text-white">
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center rounded-full h-10 w-10 bg-white">
                            <div className="flex items-center justify-center rounded-full h-8 w-8 ring-2 ring-primary-500 bg-white">
                                <img src="/assets/logo.png" height={22} width={22} alt="Logo" />
                            </div>
                        </div>
                        <h1 className="text-white font-bold text-lg whitespace-nowrap">
                            부산도시철도 사상하단선 관리자 페이지
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-end text-end leading-tight gap-1">
                            <p className="text-gray-100">{user?.name ? `${user.name}님` : '관리자님'}</p>
                            <p className="text-xs text-gray-200">접속 중</p>
                        </div>
                        <Button className="h-9 w-24 px-4 text-sm" onClick={logOut}>로그아웃</Button>
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