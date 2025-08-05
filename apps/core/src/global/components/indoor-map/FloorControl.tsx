import { useState, useEffect } from 'react';
import { Model } from '@plug/engine/src';

interface Floor {
  floorId: number;
  name: string;
}

interface FloorControlProps {
  floors?: Floor[];
  className?: string;
}

export const FloorControl: React.FC<FloorControlProps> = ({ floors = [], className = "" }) => {
  const [visibleFloors, setVisibleFloors] = useState<Set<number>>(new Set());
  const [allVisible, setAllVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (floors.length > 0) {
      const allFloorIds = new Set(floors.map(f => f.floorId));
      setVisibleFloors(allFloorIds);
      setAllVisible(true);
    }
  }, [floors]);

  const toggleFloor = (floorId: number) => {
    const newVisibleFloors = new Set(visibleFloors);
    
    if (newVisibleFloors.has(floorId)) {
      newVisibleFloors.delete(floorId);
      Model.Hide(floorId.toString());
    } else {
      newVisibleFloors.add(floorId);
      Model.Show(floorId.toString());
    }
    
    setVisibleFloors(newVisibleFloors);
    setAllVisible(newVisibleFloors.size === floors.length);
  };

  const toggleAllFloors = () => {
    if (allVisible) {
      setVisibleFloors(new Set());
      setAllVisible(false);
      Model.HideAll();
    } else {
      const allFloorIds = new Set(floors.map(f => f.floorId));
      setVisibleFloors(allFloorIds);
      setAllVisible(true);
      Model.ShowAll();
    }
  };

  if (floors.length === 0) {
    return null;
  }

  return (
    <div className={`${className} relative bg-white/5 backdrop-blur-xxs border border-white/30 shadow-lg overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/10 to-white/15 animate-pulse"></div>
        {isExpanded && (
          <div className="relative z-10 border-b border-white/20">
            <div className="flex items-center justify-between mb-4 pt-2 px-2">
              <div className="flex items-center space-x-2 select-none">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <h3 className="text-sm font-semibold text-gray-100">층별 보기</h3>
              </div>
              <button
                onClick={toggleAllFloors}
                className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 text-gray-100 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/20 cursor-pointer select-none"
              >
                {allVisible ? "모두 숨기기" : "모두 보기"}
              </button>
            </div>
            
            <div 
              className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
            >
              {floors.length > 15 && (
                <div className="sticky top-0 bg-blue-400/20 border border-blue-300/30 backdrop-blur-sm p-3 z-10">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-blue-100 font-medium">
                      🏢 총 {floors.length}개 층
                    </p>
                    <div className="text-xs text-blue-200">
                      {visibleFloors.size}개 표시 중
                    </div>
                  </div>
                </div>
              )}
              {floors
                .sort((a, b) => {
                  return b.floorId - a.floorId;
                })
                .map((floor) => (
                <div
                  key={floor.floorId}
                  className="flex items-center justify-between p-3 hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3 select-none">
                    <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      visibleFloors.has(floor.floorId) 
                        ? 'bg-green-400 shadow-md' 
                        : 'bg-gray-400'
                    }`}></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-100 group-hover:text-white select-none">
                        {floor.name}
                      </span>
                      {floors.length > 10 && (
                        <span className="text-xs text-gray-300 select-none">
                          ID: {floor.floorId}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFloor(floor.floorId)}
                    className={`w-8 h-8 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      visibleFloors.has(floor.floorId)
                        ? 'text-green-400 hover:text-green-300'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {visibleFloors.has(floor.floorId) ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="relative z-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-start select-none">
                <span className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors">
                  층 선택
                </span>
                <span className="text-xs text-gray-300">
                  {floors.length > 15 ? `${floors.length}층 건물` : `${visibleFloors.size}개 층 표시`}
                </span>
              </div>
            </div>
            <div className="ml-2">
              <svg 
                className={`w-4 h-4 text-gray-300 group-hover:text-gray-100 transition-all duration-200 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>
    </div>
  );
};
