import React, { useEffect, useState } from 'react';
import { IndoorMapViewer } from '@/global/components';
import { FacilityType } from '@plug/common-services';

interface IndoorMapProps {
  facilityId: number;
  facilityType: FacilityType;
  onOutdoorButtonClick?: () => void;
}

const IndoorMap: React.FC<IndoorMapProps> = ({ facilityId, facilityType, onOutdoorButtonClick }) => {
  const [has3DDrawing, setHas3DDrawing] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // TODO: 여기서 실제로 해당 시설에 3D 도면이 있는지 확인하는 로직 추가
    // 임시로 랜덤하게 설정 (실제로는 API 호출 또는 데이터 확인)
    const checkDrawing = async () => {
      // 예시: 시설 ID가 짝수이면 3D 도면이 있다고 가정
      const hasDrawing = facilityId % 2 === 0;
      setHas3DDrawing(hasDrawing);
      
      // 3D 도면이 없으면 카운트다운 시작
      if (!hasDrawing) {
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              if (onOutdoorButtonClick) {
                onOutdoorButtonClick();
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      }
    };
    
    checkDrawing();
  }, [facilityId, onOutdoorButtonClick]);

  // 3D 도면 확인 중인 경우
  if (has3DDrawing === null) {
    return (
      <div className="w-full h-full relative flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">3D 도면을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 3D 도면이 없는 경우
  if (!has3DDrawing) {
    return (
      <div className="w-full h-full relative flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="mb-6">
            <svg 
              className="w-16 h-16 mx-auto mb-4 text-yellow-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">3D 도면이 없습니다</h2>
            <p className="text-lg mb-6">잠시 뒤에 실외로 전환됩니다...</p>
            <div className="text-4xl font-bold text-yellow-400 mb-4">{countdown}</div>
          </div>
          
          {onOutdoorButtonClick && (
            <button
              onClick={onOutdoorButtonClick}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              지금 실외로 나가기
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3D 도면이 있는 경우
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
