import { useEffect, useRef } from 'react';
import { Event, Effect } from '@plug/engine';
import { useIndoorStore } from '@/app/store/indoorStore';

export interface IndoorPoiTarget { id?: string; property?: Record<string, unknown> }
interface PoiPointerUpEvent { target?: IndoorPoiTarget | null }
interface PoiPointerMoveEvent { target?: IndoorPoiTarget | null }

export interface UseIndoorPoiEventsOptions {
  onPoiSelect?: (target: IndoorPoiTarget | undefined | null) => void;
  enableHoverOutline?: boolean;
  hoverCursor?: string;
  cursorTargetElement?: HTMLElement | null;
}

export function useIndoorPoiEvents({
  onPoiSelect,
  enableHoverOutline = true,
  hoverCursor = 'pointer',
  cursorTargetElement,
}: UseIndoorPoiEventsOptions) {
  const outlinedRef = useRef<string | undefined>(undefined);
  const originalCursorRef = useRef<string | undefined>(undefined);
  const findDeviceByFeatureId = useIndoorStore((s) => s.findDeviceByFeatureId);
  const findCctvByFeatureId = useIndoorStore((s) => s.findCctvByFeatureId);

  useEffect(() => {
    if (!onPoiSelect) return;

    const handlePointerUp = (evt: PoiPointerUpEvent) => { onPoiSelect(evt?.target); };
    Event.AddEventListener('onPoiPointerUp' as never, handlePointerUp as never);

    return () => { Event.RemoveEventListener('onPoiPointerUp' as never, handlePointerUp as never); };
  }, [onPoiSelect]);

  useEffect(() => {
    if (!enableHoverOutline) return;

    const cursorEl: HTMLElement | null = cursorTargetElement ?? (typeof document !== 'undefined' ? document.body : null);
    if (cursorEl && originalCursorRef.current === undefined) {
      originalCursorRef.current = cursorEl.style.cursor;
    }

    const setCursor = (value: string | null) => {
      if (cursorEl) cursorEl.style.cursor = value ?? '';
    };

    const clearOutline = () => {
      if (outlinedRef.current) {
        Effect.Outline.Clear();
        outlinedRef.current = undefined;
      }
    };

    const handlePointerMove = (evt: PoiPointerMoveEvent) => {
      const id = evt?.target?.id;
      const hasAssociation = !!(id && (findDeviceByFeatureId(id) || findCctvByFeatureId(id)));

      if (id && hasAssociation) {
        if (outlinedRef.current !== id) {
          Effect.Outline.SetPoiOutline(id as never);
          outlinedRef.current = id;
        }
        setCursor(hoverCursor);
        return;
      }

      clearOutline();
      setCursor(originalCursorRef.current || null);
    };

    Event.AddEventListener('onPoiPointerMove' as never, handlePointerMove as never);

    return () => {
      Event.RemoveEventListener('onPoiPointerMove' as never, handlePointerMove as never);
      clearOutline();
      setCursor(originalCursorRef.current || null);
    };
  }, [enableHoverOutline, hoverCursor, cursorTargetElement, findDeviceByFeatureId, findCctvByFeatureId]);
}

export default useIndoorPoiEvents;
