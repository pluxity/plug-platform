import React from 'react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFlyToHome?: () => void;
  onSavePosition?: () => void;
  onFlyToSaved?: () => void;
  hasSavedPosition?: boolean;
  className?: string;
}

/**
 * 맵 컨트롤 컴포넌트 - 확대/축소 및 카메라 위치 관련 기능 제공
 * VWorldMap과 OSMMap 모두에서 재사용 가능합니다.
 */
export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onFlyToHome,
  onSavePosition,
  onFlyToSaved,
  hasSavedPosition = false,
  className = ''
}) => {
  return (
    <div className={`absolute top-4 right-4 z-10 flex flex-col space-y-2 ${className}`}>
      {/* 아이콘 기반 맵 컨트롤 버튼 */}
      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        {/* 확대 버튼 - 아이콘 */}
        <button
          className="p-2 hover:bg-gray-100 text-gray-800 flex items-center justify-center border-b border-gray-200"
          onClick={onZoomIn}
          title="확대"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </button>
        
        {/* 축소 버튼 - 아이콘 */}
        <button
          className="p-2 hover:bg-gray-100 text-gray-800 flex items-center justify-center"
          onClick={onZoomOut}
          title="축소"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </button>
      </div>
      
      {/* 기본 위치로 이동 버튼 (홈) - 아이콘 */}
      {onFlyToHome && (
        <button
          className="p-2 bg-white hover:bg-gray-100 text-gray-800 rounded-lg shadow-md flex items-center justify-center"
          onClick={onFlyToHome}
          title="기본 위치로 이동"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>
      )}
      
      {/* 카메라 위치 저장/이동 버튼 (선택적) */}
      {onSavePosition && onFlyToSaved && (
        <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <button
            className="p-2 hover:bg-gray-100 text-gray-800 border-b border-gray-200 flex items-center justify-center"
            onClick={onSavePosition}
            title="현재 카메라 위치 저장"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
          </button>
          <button
            className={`p-2 flex items-center justify-center ${
              hasSavedPosition 
                ? 'hover:bg-gray-100 text-gray-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            onClick={onFlyToSaved}
            disabled={!hasSavedPosition}
            title="저장된 카메라 위치로 이동"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
              <circle cx="12" cy="7" r="3"></circle>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MapControls; 