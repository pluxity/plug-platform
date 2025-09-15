import { buildWhepUrl, performWhepNegotiation, prepareReceiverPeerConnection } from '@/global/webrtc/whep';
import { createVideoPlayerHtml } from '@/global/utils/displayUtils';

import { useCallback, useEffect, useRef } from 'react';

import { Poi } from '@plug/engine';
export interface UsePoiEmbeddedWebRTCOptions {
  onError?: (poiId: string, error: unknown) => void;
  resolvePath?: (event: unknown) => string | null | undefined;
  width?: number;
  aspect?: number;
  muted?: boolean;
  controls?: boolean;
}

export interface UsePoiEmbeddedWebRTCResult {
  onPoiPointerUp: (evt: unknown) => void;
  startPoi: (poiId: string, pathOrDeviceId?: string | number | null) => void;
  stopPoi: (poiId: string) => void;
  stopAll: () => void;
}

interface PoiEventTarget { id?: string; property?: { deviceId?: string | number | null; deviceID?: string | number | null } }

export function usePoiEmbeddedWebRTC(options: UsePoiEmbeddedWebRTCOptions = {}): UsePoiEmbeddedWebRTCResult {
  const { onError, muted = true, controls = true } = options;
  const poiSessionsRef = useRef<Record<string, { pc: RTCPeerConnection; abort?: AbortController }>>({});

  const stopPoi = useCallback((poiId: string) => {
    const session = poiSessionsRef.current[poiId];
    if (!session) return;
    try {
      session.abort?.abort();
      session.pc.getSenders().forEach((s) => { s.track?.stop(); });
      session.pc.close();
    } catch (e) {
      console.error('[usePoiEmbeddedWebRTC] stopPoi error', poiId, e);
    } finally {
      delete poiSessionsRef.current[poiId];
    }
  }, []);

  const stopAll = useCallback(() => {
    Object.keys(poiSessionsRef.current).forEach(stopPoi);
  }, [stopPoi]);

  const startPoiVideo = useCallback(async (poiId: string, streamKey?: string | number | null) => {
    if (!poiId) return;
    const path = (streamKey ?? poiId)?.toString();
    stopPoi(poiId);

    const videoId = `poi-video-${poiId}`;
    const closeBtnId = `poi-video-close-${poiId}`;

    const html = createVideoPlayerHtml(videoId, closeBtnId, muted, controls);
    Poi.SetTextInnerHtml(poiId, html);

    await new Promise((r) => setTimeout(r, 0));
    const videoEl = document.getElementById(videoId) as HTMLVideoElement | null;
    const closeBtn = document.getElementById(closeBtnId) as HTMLButtonElement | null;
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        stopPoi(poiId);
        try { Poi.SetTextInnerHtml(poiId, ''); } catch { /* ignore */ }
      }, { once: true });
    }
    
    if (!videoEl) return;

  const metaEnv = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
  const host = metaEnv.VITE_WEBRTC_HOST || metaEnv.VITE_CCTV_HOST || '192.168.4.8';
  const port = metaEnv.VITE_WEBRTC_PORT || metaEnv.VITE_CCTV_PORT || '8889';

    const pc = prepareReceiverPeerConnection((stream) => {
      if (videoEl && !videoEl.srcObject) {
        videoEl.srcObject = stream;
        try { videoEl.play(); } catch (e) { console.error('[usePoiEmbeddedWebRTC] video play error', poiId, e); }
      }
    });
    const abort = new AbortController();
    poiSessionsRef.current[poiId] = { pc, abort };
    try {
      const url = buildWhepUrl(host, port, path);
      await performWhepNegotiation(pc, url, abort.signal);
    if (poiSessionsRef.current[poiId]?.pc !== pc) return;
    } catch (err) {
      console.error('POI WebRTC failed', err);
      stopPoi(poiId);
      onError?.(poiId, err);
    }
  }, [controls, muted, onError, stopPoi]);

  const onPoiPointerUp = useCallback((evt: unknown) => {
    const target = (evt as { target?: PoiEventTarget } | undefined)?.target;
    const poiId = target?.id;
    if (!poiId) return;
    // Prefer deviceId/deviceID if present; fallback to poiId
    const deviceId = target?.property?.deviceId ?? target?.property?.deviceID ?? null;
    startPoiVideo(poiId, deviceId);
  }, [startPoiVideo]);

  useEffect(() => () => { stopAll(); }, [stopAll]);

  const startPoi = (poiId: string, pathOrDeviceId?: string | number | null) => {
    if (!poiId) return;
    startPoiVideo(poiId, pathOrDeviceId).catch((err) => {
      console.error('[usePoiEmbeddedWebRTC] manual start error', poiId, err);
      onError?.(poiId, err);
    });
  };

  return { onPoiPointerUp, stopPoi, stopAll, startPoi };
}

export default usePoiEmbeddedWebRTC;
