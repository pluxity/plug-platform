import { IndoorMapViewer } from '@/global/components';
import { FacilityFactory } from '@plug/common-services';

interface IndoorMapProps {
  facilityId: number;
  facilityType: FacilityFactory;
  onOutdoorButtonClick?: () => void;
}

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityId, facilityType, onOutdoorButtonClick }) => {
  return (
    <IndoorMapViewer 
      facilityId={facilityId}
      facilityType={facilityType}
      showFloorControl={true}
      floorControlPosition="top-right"
      showOutdoorButton={!!onOutdoorButtonClick}
      onOutdoorButtonClick={onOutdoorButtonClick}
      className="w-full h-full"
    />
  );
};

export default IndoorMap;
