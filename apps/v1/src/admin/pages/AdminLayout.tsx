import React from 'react';
import { Button } from '@plug/ui';
import {Outlet, Link} from 'react-router-dom';
import {useProfileStore} from "@plug/v1/auth/controller/useProfileStore";
import {logOut} from "@plug/v1/auth/api/auth";

const AdminLayout = () => {
    const user = useProfileStore((state) => state.user);

    return (
        <>
            <div className='h-screen flex flex-col overflow-hidden'>
                <header
                    className="h-16 relative z-10 flex items-center justify-between px-6 py-2.5 bg-primary-600 backdrop-blur-sm shadow-md text-white">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:opacity-75 transition-opacity"
                        title="대시보드로 이동">
                        <div
                            className="flex items-center justify-center rounded-full h-10 w-10 bg-white shadow-lg transition-transform hover:scale-105">
                            <div
                                className="flex items-center justify-center rounded-full h-8 w-8 ring-2 ring-primary-500 bg-white">
                                <img src="/assets/logo.png" height={22} width={22} alt="Logo"/>
                            </div>
                        </div>
                        <h1 className="text-white font-bold text-lg whitespace-nowrap">
                            부산도시철도 사상하단선 관리자 페이지
                        </h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div
                            className="flex items-end justify-center h-9 text-end leading-tight gap-1 bg-primary-700/80 px-3 py-1.5 rounded-lg">
                            <p className="text-white font-medium">{user?.name ? `${user.name}님` : '관리자님'}</p>
                            <p className="text-xs text-gray-200 animate-pulse">접속 중</p>
                        </div>
                        <Button className="h-9 w-24 px-4 text-sm transition-colors duration-200 hover:bg-primary-300/80"
                                onClick={logOut}>로그아웃</Button>
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