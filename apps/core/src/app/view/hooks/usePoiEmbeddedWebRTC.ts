import { useCallback, useEffect, useRef } from 'react'
import { Poi } from '@plug/engine'

export interface UsePoiEmbeddedWebRTCOptions {
  /** Called when a WebRTC session fails to start (network / WHEP error). */
  onError?: (poiId: string, error: unknown) => void
  /** Resolve streaming path (WHEP endpoint path) from POI event target. */
  resolvePath?: (event: unknown) => string | null | undefined
  /** Width of the embedded video element. */
  width?: number
  /** Aspect ratio (width / height). */
  aspect?: number
  /** Auto-mute video (default true). */
  muted?: boolean
  /** Include controls attribute (default true). */
  controls?: boolean
}

export interface UsePoiEmbeddedWebRTCResult {
  /** Pass this to useIndoorEngine's onPoiPointerUp. */
  onPoiPointerUp: (evt: unknown) => void
  /** Stop & cleanup a single POI video session. */
  stopPoi: (poiId: string) => void
  /** Stop & cleanup every active POI video session. */
  stopAll: () => void
}

interface PoiEventTarget { id?: string; property?: { deviceId?: string | number | null; deviceID?: string | number | null } }

export function usePoiEmbeddedWebRTC(options: UsePoiEmbeddedWebRTCOptions = {}): UsePoiEmbeddedWebRTCResult {
  const { onError, resolvePath, width = 200, aspect = 16 / 9, muted = true, controls = true } = options
  const poiSessionsRef = useRef<Record<string, { pc: RTCPeerConnection, abort?: AbortController }>>({})

  const stopPoi = useCallback((poiId: string) => {
    const session = poiSessionsRef.current[poiId]
    if (!session) return
    try { session.abort?.abort() } catch { /* ignore */ }
    try { session.pc.getSenders().forEach(s => { try { s.track?.stop() } catch { /* ignore */ } }) } catch { /* ignore */ }
    try { session.pc.close() } catch { /* ignore */ }
    delete poiSessionsRef.current[poiId]
  }, [])

  const stopAll = useCallback(() => {
    Object.keys(poiSessionsRef.current).forEach(stopPoi)
  }, [stopPoi])

  const startPoiVideo = useCallback(async (poiId: string, path: string) => {
    if (!poiId) return
    stopPoi(poiId)
    const videoId = `poi-video-${poiId}`
    const height = Math.round(width / aspect)
    Poi.SetTextInnerHtml(poiId, `\n<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">\n  <video id="${videoId}" ${muted ? 'muted' : ''} ${controls ? 'controls' : ''} autoplay playsinline style="width:${width}px;height:${height}px;background:#000;border:1px solid #666;border-radius:4px;object-fit:contain;"></video>\n  <div style="font-size:10px;color:#fff;background:rgba(0,0,0,.5);padding:2px 4px;border-radius:3px;">${poiId}</div>\n</div>`)

    await new Promise(r => setTimeout(r, 0))
    const videoEl = document.getElementById(videoId) as HTMLVideoElement | null
    if (!videoEl) return

    const metaEnv = (import.meta as unknown as { env: Record<string, string | undefined> }).env
    const host = metaEnv.VITE_WEBRTC_HOST || metaEnv.VITE_CCTV_HOST || '192.168.4.8'
    const port = metaEnv.VITE_WEBRTC_PORT || metaEnv.VITE_CCTV_PORT || '8889'

    const pc = new RTCPeerConnection()
    const abort = new AbortController()
    poiSessionsRef.current[poiId] = { pc, abort }

    pc.addEventListener('track', evt => {
      if (evt.track.kind === 'video' && videoEl && !videoEl.srcObject && evt.streams[0]) {
        videoEl.srcObject = evt.streams[0]
        try { videoEl.play() } catch { /* ignore */ }
      }
    })
    pc.addTransceiver('video', { direction: 'recvonly' })
    pc.addTransceiver('audio', { direction: 'recvonly' })
    try {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      const url = `http://${host}:${port}/${encodeURIComponent(path)}/whep`
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/sdp' }, body: offer.sdp || '', signal: abort.signal })
      if (!res.ok) throw new Error(`WHEP ${res.status}`)
      const answerSdp = await res.text()
      if (poiSessionsRef.current[poiId]?.pc !== pc) return
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })
    } catch (err) {
      console.error('POI WebRTC failed', err)
      stopPoi(poiId)
      onError?.(poiId, err)
    }
  }, [aspect, controls, muted, onError, stopPoi, width])

  const onPoiPointerUp = useCallback((evt: unknown) => {
    const target = (evt as { target?: PoiEventTarget } | undefined)?.target
    const poiId = target?.id
    if (!poiId) return
    const path = resolvePath?.(evt) || target?.property?.deviceId || target?.property?.deviceID || 'cctv'
    startPoiVideo(poiId, String(path))
  }, [resolvePath, startPoiVideo])

  useEffect(() => () => { stopAll() }, [stopAll])

  return { onPoiPointerUp, stopPoi, stopAll }
}

export default usePoiEmbeddedWebRTC
