import { useLayoutEffect, useRef, useState } from 'react';
import { CESIUM_CREDIT_CONTAINER_ID } from '../constants';

export function useCesiumCreditContainer(id: string = CESIUM_CREDIT_CONTAINER_ID) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const existing = document.getElementById(id);
    if (existing) { ref.current = existing as HTMLDivElement; setResolvedId(existing.id); return; }
    ref.current.id = id; setResolvedId(id);
  }, [id]);
  return { creditRef: ref, creditId: resolvedId };
}
