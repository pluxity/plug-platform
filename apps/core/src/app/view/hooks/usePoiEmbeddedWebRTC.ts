import { useCallback, useEffect, useRef } from 'react'
import { Poi } from '@plug/engine'

export interface UsePoiEmbeddedWebRTCOptions {
  onError?: (poiId: string, error: unknown) => void
  resolvePath?: (event: unknown) => string | null | undefined
  width?: number
  aspect?: number
  muted?: boolean
  controls?: boolean
}

export interface UsePoiEmbeddedWebRTCResult {
  onPoiPointerUp: (evt: unknown) => void
  startPoi: (poiId: string, pathOrDeviceId?: string | number | null) => void
  stopPoi: (poiId: string) => void
  stopAll: () => void
}

interface PoiEventTarget { id?: string; property?: { deviceId?: string | number | null; deviceID?: string | number | null } }

export function usePoiEmbeddedWebRTC(options: UsePoiEmbeddedWebRTCOptions = {}): UsePoiEmbeddedWebRTCResult {
  const { onError, width = 280, aspect = 16 / 9, muted = true, controls = true } = options
  const poiSessionsRef = useRef<Record<string, { pc: RTCPeerConnection, abort?: AbortController }>>({})

  const stopPoi = useCallback((poiId: string) => {
    const session = poiSessionsRef.current[poiId]
    if (!session) return
    try {
      session.abort?.abort()
    } catch (e) {
      console.error('[usePoiEmbeddedWebRTC] abort error', poiId, e)
    }
    try {
      session.pc.getSenders().forEach(s => {
        try { s.track?.stop() } catch (e) { console.error('[usePoiEmbeddedWebRTC] track stop error', poiId, e) }
      })
    } catch (e) {
      console.error('[usePoiEmbeddedWebRTC] sender iteration error', poiId, e)
    }
    try {
      session.pc.close()
    } catch (e) {
      console.error('[usePoiEmbeddedWebRTC] pc close error', poiId, e)
    }
    delete poiSessionsRef.current[poiId]
  }, [])

  const stopAll = useCallback(() => {
    Object.keys(poiSessionsRef.current).forEach(stopPoi)
  }, [stopPoi])

  const startPoiVideo = useCallback(async (poiId: string, streamKey?: string | number | null) => {
    if (!poiId) return
    const path = (streamKey ?? poiId)?.toString()
    stopPoi(poiId)
    const videoId = `poi-video-${poiId}`
    const height = Math.round(width / aspect)
    const html = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
            <video
              id="${videoId}"
              ${muted ? 'muted' : ''}
              ${controls ? 'controls' : ''}
              autoplay
              playsinline
              style="width:${width}px;height:${height}px;background:#000;border:1px solid #666;border-radius:4px;object-fit:contain;"
            ></video>
          </div>`
    Poi.SetTextInnerHtml(poiId, html)

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
        try { videoEl.play() } catch (e) { console.error('[usePoiEmbeddedWebRTC] video play error', poiId, e) }
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
    // Prefer deviceId/deviceID if present; fallback to poiId
    const deviceId = target?.property?.deviceId ?? target?.property?.deviceID ?? null
    startPoiVideo(poiId, deviceId)
  }, [startPoiVideo])

  useEffect(() => () => { stopAll() }, [stopAll])

  const startPoi = (poiId: string, pathOrDeviceId?: string | number | null) => {
    if (!poiId) return
    startPoiVideo(poiId, pathOrDeviceId).catch(err => {
      console.error('[usePoiEmbeddedWebRTC] manual start error', poiId, err)
      onError?.(poiId, err)
    })
  }

  return { onPoiPointerUp, stopPoi, stopAll, startPoi }
}

export default usePoiEmbeddedWebRTC
