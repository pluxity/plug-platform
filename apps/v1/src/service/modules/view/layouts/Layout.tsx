import { Outlet } from 'react-router-dom';
import Header from "@plug/v1/service/modules/view/components/Header/Header";
import Sidebar from "@plug/v1/service/modules/view/components/Sidebar/Sidebar";

const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen bg-pink-500">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 relative">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
