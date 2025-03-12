import React from 'react';

interface MapToggleControlsProps {
  showBuildings?: boolean;
  onToggleBuildings?: () => void;
  buildingLabel?: string;
  
  showHeatmap?: boolean;
  onToggleHeatmap?: () => void;
  heatmapLabel?: string;
  
  selectedHeight?: number;
  onHeightChange?: (height: number) => void;
  heightOptions?: number[];
  
  // 고도별 히트맵 표시 상태 및 토글 함수 (선택적)
  visibleHeatmaps?: Record<string, boolean>;
  onToggleHeightHeatmap?: (height: string) => void;
  heightHeatmapOptions?: string[];
  
  className?: string;
}

/**
 * 맵 토글 컨트롤 컴포넌트 - 건물, 히트맵 등의 표시/숨김 토글 및 고도 선택 기능
 * VWorldMap과 OSMMap 모두에서 재사용 가능합니다.
 */
export const MapToggleControls: React.FC<MapToggleControlsProps> = ({
  // 건물 토글
  showBuildings,
  onToggleBuildings,
  buildingLabel = '건물',
  
  showHeatmap,
  onToggleHeatmap,
  heatmapLabel = '히트맵',
  
  selectedHeight,
  onHeightChange,
  heightOptions = [30, 60, 90],
  
  visibleHeatmaps,
  onToggleHeightHeatmap,
  heightHeatmapOptions = ['30m', '60m', '90m'],
  
  className = ''
}) => {
  return (
    <div className={`absolute bottom-4 left-4 z-10 flex flex-col space-y-2 ${className}`}>
      {/* 건물 토글 버튼 (선택적) */}
      {onToggleBuildings && (
        <button
          className={`px-4 py-2 rounded-lg shadow-md font-medium ${
            showBuildings ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
          }`}
          onClick={onToggleBuildings}
        >
          {showBuildings ? `${buildingLabel} 숨기기` : `${buildingLabel} 표시하기`}
        </button>
      )}
      
      {/* 히트맵 토글 버튼 (선택적) */}
      {onToggleHeatmap && (
        <button
          className={`px-4 py-2 rounded-lg shadow-md font-medium ${
            showHeatmap ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
          }`}
          onClick={onToggleHeatmap}
        >
          {showHeatmap ? `${heatmapLabel} 숨기기` : `${heatmapLabel} 표시하기`}
        </button>
      )}
      
      {/* 단일 고도 선택 UI (레거시, 선택적) */}
      {onHeightChange && selectedHeight !== undefined && (
        <div className="mt-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-2 bg-gray-100 text-gray-800 font-medium text-center border-b border-gray-200">
            고도 선택
          </div>
          <div className="flex">
            {heightOptions.map((height) => (
              <button
                key={height}
                className={`flex-1 px-2 py-2 text-sm font-medium ${
                  selectedHeight === height
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-800'
                } ${
                  height !== heightOptions[0] ? 'border-l border-gray-200' : ''
                }`}
                onClick={() => onHeightChange(height)}
              >
                {height}m
              </button>
            ))}
          </div>
        </div>
      )}
      
      {showHeatmap && onToggleHeightHeatmap && visibleHeatmaps && (
        <div className="mt-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-2 bg-gray-100 text-gray-800 font-medium text-center border-b border-gray-200">
            히트맵 고도 선택
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row">
              {heightHeatmapOptions.map((height, index) => (
                <button
                  key={height}
                  className={`flex-1 px-2 py-2 text-sm font-medium ${
                    visibleHeatmaps[height] ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-800'
                  } ${
                    index > 0 && index < heightHeatmapOptions.length - 1 ? 'border-l border-r border-gray-200' : 
                    index > 0 ? 'border-l border-gray-200' : 
                    index < heightHeatmapOptions.length - 1 ? 'border-r border-gray-200' : ''
                  }`}
                  onClick={() => onToggleHeightHeatmap(height)}
                >
                  {height} {visibleHeatmaps[height] ? '✓' : ''}
                </button>
              ))}
            </div>
            <div className="px-4 py-2 bg-gray-100 text-xs text-center border-t border-gray-200">
              여러 고도를 동시에 선택할 수 있습니다
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapToggleControls; 