import { buildWhepUrl, performWhepNegotiation, prepareReceiverPeerConnection } from '@/global/webrtc/whep'

import { useCallback, useEffect, useRef, useState } from 'react'
export interface UseWebRTCReceiverOptions {
  host: string
  path: string
  port?: string | number
  enabled: boolean
  retries?: number
  delayBaseMs?: number
}

export type WebRTCReceiverStatus = 'idle' | 'connecting' | 'connected' | 'error'

export interface UseWebRTCReceiverResult {
  videoRef: React.RefObject<HTMLVideoElement | null>
  status: WebRTCReceiverStatus
  error: string | null
  restart: () => void
  stop: () => void
}

export function useWebRTCReceiver (options: UseWebRTCReceiverOptions): UseWebRTCReceiverResult {
  const { host, path, enabled, port, retries = 3, delayBaseMs = 400 } = options
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const fetchAbortControllerRef = useRef<AbortController | null>(null)
  const [status, setStatus] = useState<WebRTCReceiverStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const connectionGenerationRef = useRef(0)
  const resolvedPort = String(port || import.meta.env.VITE_WEBRTC_PORT || import.meta.env.VITE_CCTV_PORT || '8889')

  const cleanup = useCallback(() => {
    try { fetchAbortControllerRef.current?.abort() } catch (err) { console.error(err) }
    fetchAbortControllerRef.current = null
    if (peerConnectionRef.current) {
      try {
        peerConnectionRef.current.getSenders().forEach(sender => {
          try { sender.track?.stop() } catch (err) { console.error(err) }
        })
      } catch (err) { console.error(err) }
      try { peerConnectionRef.current.close() } catch (err) { console.error(err) }
    }
    peerConnectionRef.current = null
    if (videoRef.current) {
      try { videoRef.current.srcObject = null } catch (err) { console.error(err) }
    }
  }, [])

  const connect = useCallback(async (generation: number) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    for (let attemptIndex = 1; attemptIndex <= retries; attemptIndex++) {
      if (connectionGenerationRef.current !== generation || !enabled) return
      cleanup()
      setStatus('connecting')
      setError(null)
      try {
        const peerConnection = prepareReceiverPeerConnection(stream => {
          const element = videoRef.current
            if (element && !element.srcObject) {
              element.srcObject = stream
              try { element.play?.() } catch (err) { console.error(err) }
            }
        })
        peerConnectionRef.current = peerConnection
        fetchAbortControllerRef.current = new AbortController()
        const url = buildWhepUrl(host, resolvedPort, path)
        await performWhepNegotiation(peerConnection, url, fetchAbortControllerRef.current.signal)
        if (connectionGenerationRef.current !== generation) return
        setStatus('connected')
        return
      } catch (err) {
        console.error(err)
        if (connectionGenerationRef.current !== generation) return
        if (attemptIndex === retries) {
          cleanup()
          setStatus('error')
          setError(err instanceof Error ? err.message : String(err))
          return
        }
        await delay(delayBaseMs * attemptIndex)
      }
    }
  }, [cleanup, delayBaseMs, enabled, host, path, resolvedPort, retries])

  const start = useCallback(() => {
    if (!enabled) return
    connectionGenerationRef.current++
    connect(connectionGenerationRef.current)
  }, [connect, enabled])

  const stop = useCallback(() => {
    connectionGenerationRef.current++
    cleanup()
    setStatus('idle')
  }, [cleanup])

  const restart = useCallback(() => {
    stop()
    if (enabled) start()
  }, [enabled, start, stop])

  useEffect(() => {
    if (enabled) {
      start()
    } else {
      stop()
    }
    return () => { stop() }
  }, [enabled, host, path, resolvedPort, start, stop])

  return { videoRef, status, error, restart, stop }
}

export default useWebRTCReceiver
