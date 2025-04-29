import MapViewer from "@plug/v1/service/modules/view/components/layouts/MapViewer/MapViewer";
import InfoPanel from "@plug/v1/service/modules/view/components/layouts/InfoPanel/InfoPanel";
import FloatingButtons from "@plug/v1/service/modules/view/components/layouts/FloatingButtons/FloatingButtons";
import Header from "@plug/v1/service/modules/view/components/layouts/Header/Header";
import Sidebar from "@plug/v1/service/modules/view/components/layouts/Sidebar/Sidebar";

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
