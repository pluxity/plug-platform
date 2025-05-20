import { Button, Sidebar, Tab } from '@plug/ui';
import { Outlet, useNavigate } from 'react-router-dom';
import { ViewerTabContent } from './components/ViewerTabContent';
import { LodSetModal } from './modals/LodSet';
import { useState } from 'react';

const Viewer = () => {
    {/* Tab Trigger 동작 */}
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('poi');

    const handleTabChange = (value: string) => {
        setCurrentTab(value);
        navigate(`/admin/viewer/${value}`);
    };

    {/* Lod 설정 모달 show/hide */}
    const [isLodSetOpen, setIsLodSetOpen] = useState(false);

    const handleOpenLodSet = () => {setIsLodSetOpen(true);};
    const handleCloseLodSet = () => {setIsLodSetOpen(false);};

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
                <div className='flex flex-1 overflow-hidden'>
                    <Sidebar className='h-full w-100'>
                        <div className='flex-1 flex flex-col relative'>
                            <Tab value={currentTab} onValueChange={handleTabChange}>
                                <Tab.List color='primary' className="text-sm whitespace-nowrap">
                                    <Tab.Trigger value="poi" className="bg-gray-100 rounded-sm">POI</Tab.Trigger>
                                    <Tab.Trigger value="text3d" className="bg-gray-100 rounded-sm">TEXT 3D</Tab.Trigger>
                                    <Tab.Trigger value="topology" className="bg-gray-100 rounded-sm">TOPOLOGY</Tab.Trigger>
                                </Tab.List>
                                <ViewerTabContent title="poi" />
                                <ViewerTabContent title="text3d" />
                                <ViewerTabContent title="topology" />
                            </Tab>
                        </div>
                        <Sidebar.Footer className="rounded-sm bg-gray-100 flex gap-2">
                            <Button color='primary'> POI 등록 </Button>
                            <Button color='secondary'> POI 일괄등록 </Button>
                            <Button className='bg-gray-400 text-white' onClick={(handleOpenLodSet)}> LOD 설정 </Button>
                        </Sidebar.Footer>
                    </Sidebar>
                    <div className='flex-1 flex flex-col'>
                        <main className='flex-1 overflow-auto'>
                            <Outlet />
                        </main>
                        <footer className='py-2 px-1 border-t border-gray-200 text-xs text-center'>
                            <p>Copyright © 2025 PLUXITY.co.,Ltd. All rights reserved.</p>
                        </footer>
                    </div>
                </div>
            </div>
            <LodSetModal 
                isOpen={isLodSetOpen}
                onClose={handleCloseLodSet}
            />
        </>
    );
};

export default Viewer;