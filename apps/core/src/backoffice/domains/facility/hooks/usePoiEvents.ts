import { useEffect } from 'react';
import { Event, Effect } from '@plug/engine';

// 공용 POI 타입 (필요 필드만 선언)
export interface PoiData {
  id: string;
  htmlString: string;
  iconUrl: string;
  modelUrl: string;
  floorId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  property?: Record<string, unknown>;
}

interface PoiClickEvent {
  type: string;
  target: PoiData;
}

interface PoiTransformEvent {
  targets: PoiData[];
}

interface PoiMoveEvent {
  type: string;
  target?: PoiData | null;
}

export interface UsePoiEventsOptions {
  isDeleteMode: boolean;
  onPointerDelete: (poi: PoiData) => void;
  onPointerAssign: (poi: PoiData) => void;
  onTransformFinished?: (targets: PoiData[]) => void | Promise<void>;
  enableHoverOutline?: boolean; // 기본: true
  hoverCursor?: string; // 기본: 'pointer'
  cursorTargetElement?: HTMLElement | null; // 지정 안하면 document.body 사용
}

/**
 * 엔진 POI 관련 이벤트 리스너 등록/해제 전용 훅
 * - onPoiPointerUp
 * - onPoiFinishEdit
 */
export const usePoiEvents = (options: UsePoiEventsOptions) => {
  const { isDeleteMode, onPointerDelete, onPointerAssign, onTransformFinished, enableHoverOutline = true, hoverCursor = 'pointer', cursorTargetElement } = options;

  useEffect(() => {
    const handlePointerUp = (evt: PoiClickEvent) => {
      if (!evt?.target) return;
      if (isDeleteMode) {
        onPointerDelete(evt.target);
      } else {
        onPointerAssign(evt.target);
      }
    };

    Event.AddEventListener('onPoiPointerUp' as never, handlePointerUp as never);
    return () => {
      Event.RemoveEventListener('onPoiPointerUp' as never, handlePointerUp as never);
    };
  }, [isDeleteMode, onPointerDelete, onPointerAssign]);

  useEffect(() => {
    if (!onTransformFinished) return;

    const handleTransformFinish = (evt: PoiTransformEvent) => {
      const targets = evt?.targets || [];
      if (!targets.length) return;
      void onTransformFinished(targets);
    };

    Event.AddEventListener('onPoiFinishEdit' as never, handleTransformFinish as never);
    return () => {
      Event.RemoveEventListener('onPoiFinishEdit' as never, handleTransformFinish as never);
    };
  }, [onTransformFinished]);

  // Hover Outline (onPoiPointerMove)
  useEffect(() => {
    if (!enableHoverOutline) return;

    let currentOutlined: string | undefined;
    const cursorEl: HTMLElement | null = cursorTargetElement ?? (typeof document !== 'undefined' ? document.body : null);
    const originalCursor = cursorEl?.style.cursor;

    const setCursor = (val: string | null) => {
      if (!cursorEl) return;
      cursorEl.style.cursor = val ?? '';
    };

    const handlePointerMove = (evt: PoiMoveEvent) => {
      const targetId = evt?.target?.id;
      if (targetId) {
        if (currentOutlined !== targetId) {
          Effect.Outline.SetPoiOutline(targetId as never);
          currentOutlined = targetId;
        }
        setCursor(hoverCursor);
      } else {
        if (currentOutlined) {
          Effect.Outline.Clear();
          currentOutlined = undefined;
        }
        setCursor(originalCursor || null);
      }
    };

    Event.AddEventListener('onPoiPointerMove' as never, handlePointerMove as never);
    return () => {
      Event.RemoveEventListener('onPoiPointerMove' as never, handlePointerMove as never);
      if (currentOutlined) {
        Effect.Outline.Clear();
      }
      setCursor(originalCursor || null);
    };
  }, [enableHoverOutline, hoverCursor, cursorTargetElement]);
};

export default usePoiEvents;
