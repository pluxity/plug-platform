import { IndoorMapViewer } from '@/global/components';
import { FacilityFactory } from '@plug/common-services';

interface IndoorMapProps {
  facilityId: number;
  facilityType: FacilityFactory;
  onOutdoorButtonClick?: () => void;
}

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityId, facilityType, onOutdoorButtonClick }) => {
  return (
    <div className="w-full h-full relative">
      <IndoorMapViewer 
        facilityId={facilityId}
        facilityType={facilityType}
        showFloorControl={true}
        floorControlPosition="bottom-right"
        className="w-full h-full"
      />
      
      {onOutdoorButtonClick && (
        <button
          onClick={onOutdoorButtonClick}
          className="absolute top-4 right-4 z-30 group px-4 py-3 text-white hover:text-gray-200 transition-all duration-200 cursor-pointer select-none"
          title="실외 지도로 나가기"
        >
          <div className="flex items-center space-x-3">
            <svg 
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-base font-medium">실외로 나가기</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default IndoorMap;
