import MapViewer from "@plug/v1/app/modules/view/layouts/MapViewer/MapViewer";
import InfoPanel from "@plug/v1/app/modules/view/layouts/InfoPanel/InfoPanel";
import FloatingButtons from "@plug/v1/app/modules/view/layouts/Sidebar/RightSidebar";
import Header from "@plug/v1/app/modules/view/layouts/Header/Header";
import Sidebar from "@plug/v1/app/modules/view/layouts/Sidebar/LeftSidebar";

const ViewerPage = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <MapViewer />
            <Header />
            <Sidebar />
            <InfoPanel />
            <FloatingButtons />
        </div>
    );
};

export default ViewerPage;
