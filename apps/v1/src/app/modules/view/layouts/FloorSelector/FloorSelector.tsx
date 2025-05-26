import React, { useEffect, useState } from 'react';
import * as Px from '@plug/engine/src';

interface FloorItem {
  id: string;
  name: string;
}

interface FloorSelectorProps {
  floors: FloorItem[];
  currentFloor?: string;
  onFloorChange?: (floorId: string) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ 
  floors = [], 
  currentFloor = 'ALL', 
  onFloorChange 
}) => {
  const [selectedFloor, setSelectedFloor] = useState(currentFloor);
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);

  useEffect(() => {
    setSelectedFloor(currentFloor);
  }, [currentFloor]);

  const handleFloorChange = (floorId: string) => {
    if (floorId === selectedFloor) return;
    
    setSelectedFloor(floorId);
    
    Px.Model.HideAll();
    
    if(floorId === 'ALL') {
      Px.Model.ShowAll();
      Px.Camera.ExtendView(1.0);
    } else {
      Px.Model.Show(floorId);
      Px.Camera.MoveToFloor(floorId, 1.0);

    }

    if (onFloorChange) {
      onFloorChange(floorId);
    }
  };  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-l-md shadow-[-1px_0px_4px_2px_rgba(0,76,151,0.5)] bg-primary-900/20 backdrop-blur-md">
      <div className="flex items-center">
        <div className="w-9 flex flex-col justify-around items-center gap-6 py-2">
          {floors.map((floor) => (
            <div key={floor.id} className="relative">
              {hoveredFloor === floor.id && (
                <div className="absolute right-full mr-8 -mt-3 p-2 bg-white/90 backdrop-blur-sm rounded-md shadow-lg z-20 whitespace-nowrap border-primary-900 border">
                  <div className="text-xs font-bold text-primary-900 px-1">{floor.name}</div>
                  <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-0 h-0 
                    border-t-[4px] border-b-[4px] border-l-[4px] border-transparent border-l-primary-900"></div>
                </div>
              )}
              
              <div 
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-200
                  ${selectedFloor === floor.id 
                    ? 'bg-primary-900 hover:bg-primary-800' 
                    : 'bg-white/80 hover:bg-white'}`}
                onClick={() => handleFloorChange(floor.id)}
                onMouseEnter={() => setHoveredFloor(floor.id)}
                onMouseLeave={() => setHoveredFloor(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorSelector;