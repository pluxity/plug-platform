import useCesiumStore from '@/stores/cesiumStore';

interface MapControlsProps {
  initialPosition?: any; // 초기 위치 정보 (필요한 경우)
  className?: string;
}

const MapControls: React.FC<MapControlsProps> = ({
  initialPosition,
  className = ''
}) => {
  // Cesium 상태를 스토어에서 직접 가져오기
  const { viewer } = useCesiumStore();

  const zoomIn = () => {
    if (!viewer) return;
    
    try {
      const camera = viewer.camera;
      const zoomAmount = camera.positionCartographic.height * 0.5;
      camera.zoomIn(zoomAmount);
    } catch (error) {
      console.error('확대 오류:', error);
    }
  };

  const zoomOut = () => {
    if (!viewer) return;
    
    try {
      const camera = viewer.camera;
      const zoomAmount = camera.positionCartographic.height * 0.5;
      camera.zoomOut(zoomAmount);
    } catch (error) {
      console.error('축소 오류:', error);
    }
  };

  const flyToHome = async () => {
    if (!viewer) return;
    
    try {
      const Cesium = await import('cesium');
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          initialPosition.longitude,
          initialPosition.latitude,
          initialPosition.height
        ),
        orientation: {
          heading: initialPosition.heading || 0,
          pitch: initialPosition.pitch || -0.5,
          roll: initialPosition.roll || 0
        }
      });
    } catch (error) {
      console.error('홈으로 이동 오류:', error);
    }
  };

  // UI 렌더링
  return (
    <div className={`absolute top-4 right-4 z-10 flex flex-col space-y-2 ${className}`}>
      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        <button
          type="button"
          className="p-2 hover:bg-gray-100 text-gray-800 flex items-center justify-center border-b border-gray-200"
          onClick={zoomIn}
          title="확대"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </button>
        
        <button
          type="button"
          className="p-2 hover:bg-gray-100 text-gray-800 flex items-center justify-center"
          onClick={zoomOut}
          title="축소"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </button>
      </div>
      
      <button
        type="button"
        className="p-2 bg-white hover:bg-gray-100 text-gray-800 rounded-lg shadow-md flex items-center justify-center"
        onClick={flyToHome}
        title="기본 위치로 이동"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default MapControls; 