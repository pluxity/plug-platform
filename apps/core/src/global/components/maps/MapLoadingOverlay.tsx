import React from 'react';
import { useMapLoadingStore } from '@/app/store/mapLoadingStore';

const MapLoadingOverlay: React.FC = () => {
  const { isLoading, loadingMessage } = useMapLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center space-y-4">
        {/* 스피너 */}
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* 로딩 메시지 */}
        <div className="text-lg font-medium text-gray-800">
          {loadingMessage || '로딩 중...'}
        </div>
        
        {/* 진행 상태 표시 */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default MapLoadingOverlay;
