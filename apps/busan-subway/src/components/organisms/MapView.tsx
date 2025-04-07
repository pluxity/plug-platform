import React from 'react';

interface MapViewProps {
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ${className}`}>
      {/* 여기에 실제 3D 맵 구현이 들어갈 예정 */}
      <div className="text-4xl font-bold text-gray-400">
        3D 지도 영역
      </div>
    </div>
  );
}; 