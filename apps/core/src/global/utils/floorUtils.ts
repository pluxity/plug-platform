import type { FloorResponse, Floor } from '@/global/types/floor';

export const convertFloors = (floors: FloorResponse[]): Floor[] => {
  if (!floors || !Array.isArray(floors)) {
    return [];
  }

  const validFloors: Floor[] = [];
  const seenFloorIds = new Set<number>();

  for (const floor of floors) {
    const parsedFloorId = parseInt(floor.floorId, 10);
    
    if (isNaN(parsedFloorId) || seenFloorIds.has(parsedFloorId)) {
      continue;
    }

    seenFloorIds.add(parsedFloorId);
    validFloors.push({
      floorId: parsedFloorId,
      name: floor.name
    });
  }

  return validFloors;
};
