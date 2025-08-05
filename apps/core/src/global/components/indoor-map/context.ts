import { createContext, useContext } from 'react';
import { Engine3D } from '@plug/engine/src';

export interface IndoorMapContextType {
  engine3D: Engine3D | null;
  isLoading: boolean;
  modelUrl: string | null;
  showFloor: (floorId: string) => void;
  hideFloor: (floorId: string) => void;
  showAllFloors: () => void;
  hideAllFloors: () => void;
}

export const IndoorMapContext = createContext<IndoorMapContextType | null>(null);

export const useIndoorMap = () => {
  const context = useContext(IndoorMapContext);
  if (!context) {
    throw new Error('useIndoorMap must be used within IndoorMapProvider');
  }
  return context;
};
