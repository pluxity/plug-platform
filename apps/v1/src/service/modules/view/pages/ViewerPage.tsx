import MapViewer from "@plug/v1/service/modules/view/components/MapViewer/MapViewer";
import InfoPanel from "@plug/v1/service/modules/view/components/InfoPanel/InfoPanel";
import FloatingButtons from "@plug/v1/service/modules/view/components/FloatingButtons/FloatingButtons";

const ViewerPage = () => {
    return (
        <div className="relative w-full h-full bg-purple-500">
            <MapViewer />
            <InfoPanel />
            <FloatingButtons />
        </div>
    );
};

export default ViewerPage;
