import type { Floor } from '@/global/types';

import { useState, useEffect, useMemo } from 'react';

import { Model } from '@plug/engine';
interface FloorControlProps {
  floors?: Floor[];
  className?: string;
}

export const FloorControl: React.FC<FloorControlProps> = ({ floors = [], className = '' }) => {
  const [visibleFloors, setVisibleFloors] = useState<Set<number>>(new Set());
  const [allVisible, setAllVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterText, setFilterText] = useState('');

  // Initialize all floors visible when floors change
  useEffect(() => {
    if (floors.length > 0) {
      const allFloorIds = new Set(floors.map((f) => f.floorId));
      setVisibleFloors(allFloorIds);
      setAllVisible(true);
    }
  }, [floors]);

  const toggleFloor = (floorId: number) => {
    const newVisible = new Set(visibleFloors);

    if (newVisible.has(floorId)) {
      newVisible.delete(floorId);
      Model.Hide(floorId.toString());
    } else {
      newVisible.add(floorId);
      Model.Show(floorId.toString());
    }

    setVisibleFloors(newVisible);
    setAllVisible(newVisible.size === floors.length);
  };

  // Removed single-floor view (Only) logic for now

  const toggleAllFloors = () => {
    if (allVisible) {
      setVisibleFloors(new Set());
      setAllVisible(false);
      Model.HideAll();
    } else {
      const allFloorIds = new Set(floors.map((f) => f.floorId));
      setVisibleFloors(allFloorIds);
      setAllVisible(true);
      Model.ShowAll();
    }
  };

  const filteredFloors = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    const arr = q
      ? floors.filter((f) => `${f.name}`.toLowerCase().includes(q) || `${f.floorId}`.includes(q))
      : floors;
    // Highest floor first by id
    return [...arr].sort((a, b) => b.floorId - a.floorId);
  }, [floors, filterText]);

  if (floors.length === 0) return null;

  return (
    <div className={`${className} liquid-glass relative overflow-hidden`}>
      <div
        className={`relative z-10 border-b border-white/20 transition-all duration-400 ease-out transform overflow-hidden ${
          isExpanded 
            ? 'max-h-screen opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 -translate-y-4'
        }`}
      >
        {/* Header row */}
        <div className={`transition-all duration-500 delay-75 ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-between mb-3 pt-2 px-2">
            <div className="flex items-center space-x-2 select-none">
              <h3 className="text-sm font-semibold text-secondary-100">층별 보기</h3>
            </div>
            <button
              onClick={toggleAllFloors}
              className="liquid-glass liquid-glass-secondary text-xs px-3 py-1 text-secondary-500 cursor-pointer select-none"
            >
              {allVisible ? '모두 숨기기' : '모두 보기'}
            </button>
          </div>
        </div>

        {/* Tools row: search */}
        <div className={`transition-all duration-500 delay-150 ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center gap-2 px-2 pb-3">
            <div className="relative flex-1">
              <input
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className=" w-full bg-white/10 placeholder:text-secondary-500 text-secondary-100 text-xs px-3 py-2 rounded-md outline-none border border-secondary-100/20"
                placeholder="층 검색 (예: 3, B1, 로비)"
                aria-label="층 검색"
              />
              {filterText && (
                <button
                  onClick={() => setFilterText('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary-500 hover:text-secondary-100"
                  aria-label="검색 지우기"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={`transition-all duration-500 delay-225 ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {floors.length > 15 && (
            <div className="sticky top-0 bg-primary-1000/60 border border-primary-700/30 p-3 z-10">
              <div className="flex items-center justify-between">
                <p className="text-xs text-secondary-100 font-medium">총 {floors.length}개 층</p>
                <div className="text-xs text-primary-400">{visibleFloors.size}개 표시 중</div>
              </div>
            </div>
          )}
          <div className="min-h-60 min-w-60 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            {filteredFloors.length === 0 ? (
              <div className="h-60 flex items-center justify-center">
                <div className="text-center text-xs text-secondary-100">검색 결과가 없습니다</div>
              </div>
            ) : filteredFloors.length > 14 ? (
              <div className="p-2 grid grid-cols-3 sm:grid-cols-3 gap-2">
                {filteredFloors.map((floor: Floor, index: number) => {
                  const isOn = visibleFloors.has(floor.floorId);
                  return (
                    <div 
                      key={floor.floorId} 
                      className="group relative"
                      style={{
                        animationDelay: `${index * 20}ms`,
                        animation: isExpanded ? 'fadeInUp 0.3s ease-out forwards' : 'none'
                      }}
                    >
                      <button
                        onClick={() => toggleFloor(floor.floorId)}
                        className={`w-full px-3 py-2 rounded-md text-xs font-medium border transition-all duration-200 cursor-pointer select-none text-left hover:scale-105 ${
                          isOn
                            ? 'liquid-glass liquid-glass-primary clickable text-secondary-100 shadow-lg'
                            : 'liquid-glass clickable text-secondary-100 hover:bg-white/5'
                        }`}
                        title={isOn ? '층 숨기기' : '층 보이기'}
                      >
                        <span className="block truncate">{floor.name}</span>
                        <span className="text-[10px] opacity-70">ID: {floor.floorId}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-1 px-1 pb-2">
                {filteredFloors.map((floor: Floor, index: number) => (
                  <div
                    key={floor.floorId}
                    className="flex items-center justify-between p-2 hover:bg-secondary-100/10 transition-all duration-200 group rounded hover:scale-[1.02]"
                    style={{
                      animationDelay: `${index * 15}ms`,
                      animation: isExpanded ? 'fadeInUp 0.25s ease-out forwards' : 'none'
                    }}
                  >
                    <div className="flex items-center space-x-3 select-none">
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                          visibleFloors.has(floor.floorId) ? 'bg-primary-500/70 shadow-md scale-110' : 'bg-secondary-100/20'
                        }`}
                      ></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-secondary-100 group-hover:text-secondary-100 select-none">
                          {floor.name}
                        </span>
                        {floors.length > 10 && (
                          <span className="text-[11px] text-secondary-500 select-none">ID: {floor.floorId}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFloor(floor.floorId)}
                        className={`w-8 h-8 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 ${
                          visibleFloors.has(floor.floorId)
                            ? 'text-primary-500/70 hover:text-primary-600/70'
                            : 'text-secondary-100/40 hover:text-secondary-100/60'
                        }`}
                        aria-pressed={visibleFloors.has(floor.floorId)}
                        aria-label={visibleFloors.has(floor.floorId) ? '층 숨기기' : '층 보이기'}
                      >
                        {visibleFloors.has(floor.floorId) ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / toggle */}
      <div className="relative z-10">
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500/60 to-primary-600/70 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 rounded-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="flex flex-col items-start select-none">
              <span className="text-sm font-semibold text-secondary-100 group-hover:text-secondary-100 transition-colors">층 선택</span>
              <span className="text-xs text-secondary-500">
                {floors.length > 15
                  ? `${floors.length}층 건물 · ${visibleFloors.size}개 표시`
                  : `${visibleFloors.size}개 층 표시`}
              </span>
            </div>
          </div>
          <div className="ml-2">
            <svg
              className={`w-4 h-4 text-secondary-300 group-hover:text-secondary-100 transition-all duration-200 ${
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
