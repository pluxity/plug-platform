import { useState, useCallback, useEffect } from 'react';
import * as Px from '@plug/engine/src';

export type EditMode = 'translate' | 'rotate' | 'scale' | 'none';

export interface UseEditModeResult {
  currentMode: EditMode;
  setTranslateMode: () => void;
  setRotateMode: () => void;
  setScaleMode: () => void;
  exitEdit: () => void;
}

export function useEditMode(): UseEditModeResult {
  const [currentMode, setCurrentMode] = useState<EditMode>('none');

  const exitEdit = useCallback(() => {
    setCurrentMode('none');
    Px.Poi.FinishEdit();
  }, []);

  const setTranslateMode = useCallback(() => {
    if (currentMode === 'translate') {
      exitEdit();
    } else {
      setCurrentMode('translate');
      Px.Poi.StartEdit('translate');
    }
  }, [currentMode, exitEdit]);

  const setRotateMode = useCallback(() => {
    if (currentMode === 'rotate') {
      exitEdit();
    } else {
      setCurrentMode('rotate');
      Px.Poi.StartEdit('rotate');
    }
  }, [currentMode, exitEdit]);

  const setScaleMode = useCallback(() => {
    if (currentMode === 'scale') {
      exitEdit();
    } else {
      setCurrentMode('scale');
      Px.Poi.StartEdit('scale');
    }
  }, [currentMode, exitEdit]);

  // ESC 키 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && currentMode !== 'none') {
        exitEdit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentMode, exitEdit]);

  return {
    currentMode,
    setTranslateMode,
    setRotateMode,
    setScaleMode,
    exitEdit,
  };
}
