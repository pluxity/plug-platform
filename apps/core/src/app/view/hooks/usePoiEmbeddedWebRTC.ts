import { useCallback, useEffect, useRef } from 'react';
import { Poi } from '@plug/engine';
import { buildWhepUrl, performWhepNegotiation, prepareReceiverPeerConnection } from '@/global/webrtc/whep';

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
  const { onError, width = 280, aspect = 16 / 9, muted = true, controls = true } = options;
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
    const height = Math.round(width / aspect);
    const containerStyle = {
      position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    };
    const closeBtnStyle = {
      position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', border: 'none', borderRadius: '999px',
      background: 'rgba(15,23,42,0.85)', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '14px', lineHeight: '1', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', zIndex: 100,
    };
    const videoStyle = {
      width: `${width}px`, height: `${height}px`, background: '#000', border: '1px solid #475569', borderRadius: '6px', objectFit: 'contain',
    };
    const styleToString = (styleObj: Record<string, string | number>) => Object.entries(styleObj)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');
    const html = `
      <div style="${styleToString(containerStyle)}">
        <button id="${closeBtnId}" title="닫기" aria-label="닫기"
          style="${styleToString(closeBtnStyle)}"
          onmouseenter="this.style.background='rgba(30,41,59,0.9)'" onmouseleave="this.style.background='rgba(15,23,42,0.85)'"
        >×</button>
        <video id="${videoId}" ${muted ? 'muted' : ''} ${controls ? 'controls' : ''} autoplay playsinline style="${styleToString(videoStyle)}"></video>
      </div>`
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
  }, [aspect, controls, muted, onError, stopPoi, width]);

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
