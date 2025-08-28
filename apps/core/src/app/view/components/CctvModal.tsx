import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@plug/ui'

export interface CctvModalProps {
  open: boolean
  host: string
  onClose: () => void
  title?: string
  path?: string
}

const CctvModal: React.FC<CctvModalProps> = ({ open, host, onClose, title, path = 'cctv' }) => {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])

  const cleanup = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (pcRef.current) {
      try { pcRef.current.getSenders().forEach(s => { try { s.track?.stop() } catch { /* noop */ } }) } catch { /* noop */ }
      try { pcRef.current.close() } catch { /* noop */ }
    }
    pcRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const start = useCallback(async () => {
    if (!open) return
    cleanup()
    setError(null)

    const MAX_RETRIES = 3
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      if (!open) return
      cleanup()
      try {
        const pc = new RTCPeerConnection()
        pcRef.current = pc
        abortRef.current = new AbortController()
        pc.addEventListener('track', trackEvent => {
          if (trackEvent.track.kind === 'video') {
            const videoElement = videoRef.current
            if (videoElement && !videoElement.srcObject) {
              videoElement.srcObject = trackEvent.streams[0]
              try { videoElement.play?.() } catch { /* noop */ }
            }
          }
        })
        pc.addTransceiver('video', { direction: 'recvonly' })
        pc.addTransceiver('audio', { direction: 'recvonly' })

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        const url = `http://${host}:8889/${encodeURIComponent(path)}/whep`
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: offer.sdp || '',
          signal: abortRef.current.signal
        })
        if (!response.ok) throw new Error(`WHEP 실패 (${response.status}) (시도 ${attempt}/${MAX_RETRIES})`)
        const answerSdp = await response.text()
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })
        return
      } catch (e) {
        if (attempt === MAX_RETRIES) {
          cleanup()
            setError(e instanceof Error ? e.message : String(e))
          return
        }
        await delay(400 * attempt)
      }
    }
  }, [cleanup, host, open, path])

  useEffect(() => { if (open) start(); else cleanup() }, [open, path, start, cleanup])
  useEffect(() => () => cleanup(), [cleanup])

  if (!mounted || !open) return null

  return (
    <Dialog open={open && mounted} onOpenChange={(o) => { if (!o) onClose() }}>
  <DialogContent title={title || `CCTV / ${path}`}>
        <div className='aspect-video bg-black'>
          <video ref={videoRef} className='w-full h-full object-contain bg-black' autoPlay muted playsInline controls />
        </div>
        {error && (
          <div className='px-4 py-3 text-sm text-red-400 border-t border-gray-700 break-all'>
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CctvModal
