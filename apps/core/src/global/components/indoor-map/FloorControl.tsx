import { useState, useEffect } from 'react';
import { Model } from '@plug/engine/src';
import { Button } from '@plug/ui';

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

  // 초기에는 모든 층이 보이도록 설정
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
      // 모든 층 숨기기
      setVisibleFloors(new Set());
      setAllVisible(false);
      Model.HideAll();
    } else {
      // 모든 층 보이기
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
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">층 선택</h3>
        <Button
          onClick={toggleAllFloors}
          variant={allVisible ? "default" : "outline"}
          size="sm"
        >
          {allVisible ? "모두 숨기기" : "모두 보기"}
        </Button>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {floors.map((floor) => (
          <div
            key={floor.floorId}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              {floor.name}
            </span>
            <Button
              onClick={() => toggleFloor(floor.floorId)}
              variant={visibleFloors.has(floor.floorId) ? "default" : "outline"}
              size="sm"
              className="min-w-[60px]"
            >
              {visibleFloors.has(floor.floorId) ? "숨기기" : "보기"}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {visibleFloors.size}/{floors.length} 층이 표시됨
        </p>
      </div>
    </div>
  );
};
