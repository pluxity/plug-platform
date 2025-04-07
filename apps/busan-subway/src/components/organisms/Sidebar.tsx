import React, { useState } from 'react';
import { Icon } from '../atoms/Icon';
import { SubwayLine } from '../molecules/SubwayLine';
import { StationItem } from '../molecules/StationItem';

interface SidebarProps {
  defaultOpen?: boolean;
}

interface SubwayLineData {
  lineNumber: string;
  color: string;
}

interface StationData {
  id: string;
  name: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // 부산 지하철 노선 데이터
  const subwayLines: SubwayLineData[] = [
    { lineNumber: '1호선', color: '#f97316' }, // orange-500
    { lineNumber: '2호선', color: '#22c55e' }, // green-500
    { lineNumber: '3호선', color: '#92400e' }, // brown-700
    { lineNumber: '4호선', color: '#2563eb' }, // blue-600
  ];

  // 주요 역 데이터
  const majorStations: StationData[] = [
    { id: 'seomyeon', name: '서면역' },
    { id: 'haeundae', name: '해운대역' },
    { id: 'busan', name: '부산역' },
    { id: 'dongnae', name: '동래역' },
    { id: 'gwangan', name: '광안역' },
    { id: 'nampo', name: '남포역' },
  ];

  return (
    <div className="relative h-full">
      {/* 사이드바 컨테이너 - 항상 표시됨 */}
      <div 
        className={`absolute left-0 top-0 h-full flex transition-all duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-[calc(100%-48px)]'
        }`}
      >
        {/* 메인 사이드바 컨텐츠 */}
        <div className="w-80 h-full bg-white shadow-lg overflow-y-auto">
          <div className="p-4 mt-16">
            <h2 className="text-xl font-bold mb-4">지하철 노선</h2>
            
            <div className="space-y-1 mb-6">
              {subwayLines.map((line) => (
                <SubwayLine
                  key={line.lineNumber}
                  lineNumber={line.lineNumber}
                  color={line.color}
                />
              ))}
            </div>
            
            <h2 className="text-xl font-bold mb-4">주요 역</h2>
            <ul className="space-y-2">
              {majorStations.map((station) => (
                <StationItem
                  key={station.id}
                  name={station.name}
                />
              ))}
            </ul>
          </div>
        </div>
        
        {/* 토글 탭 */}
        <div 
          className="w-12 h-20 bg-white shadow-md rounded-r-md flex items-center justify-center cursor-pointer mt-16"
          onClick={toggleSidebar}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            {isOpen ? (
              <Icon name="arrow-left" />
            ) : (
              <Icon name="arrow-right" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 