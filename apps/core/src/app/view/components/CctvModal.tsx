import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@plug/ui'
import { useWebRTCReceiver } from '../hooks/useWebRTCReceiver'

export interface CctvModalProps {
  open: boolean
  host: string
  onClose: () => void
  title?: string
  path?: string
}

const CctvModal: React.FC<CctvModalProps> = ({ open, host, onClose, title, path = 'cctv' }) => {
  const [mounted, setMounted] = useState(false)

  const { videoRef, error, stop } = useWebRTCReceiver({
    host,
    path: path || 'cctv',
    enabled: open
  })

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

  // stop when unmount
  useEffect(() => () => { stop() }, [stop])

  if (!mounted || !open) return null

  return (
    <Dialog open={open && mounted} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent title={title || `CCTV / ${path}`}>
        <div className='aspect-video bg-black'>
          <video ref={videoRef} className='w-full h-full object-contain bg-black' autoPlay muted playsInline controls />
        </div>
        {error && <div className='px-4 py-3 text-sm text-red-400 border-t border-gray-700 break-all'>{error}</div>}
      </DialogContent>
    </Dialog>
  )
}

export default CctvModal
