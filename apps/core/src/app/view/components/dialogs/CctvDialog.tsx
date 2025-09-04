import { useWebRTCReceiver } from '@/app/view/hooks/useWebRTCReceiver';

import { useEffect, useState } from 'react';

import { Dialog, DialogContent } from '@plug/ui';
export interface CctvDialogProps {
  open: boolean;
  host: string;
  onClose: () => void;
  title?: string;
  path?: string;
  width?: number;
  aspect?: number;
  autoFocusVideo?: boolean;
}

const CctvDialog = ({
  open,
  host,
  onClose,
  title,
  path = 'cctv',
  width = 480,
  aspect = 16 / 9,
  autoFocusVideo = false,
}: CctvDialogProps) => {
  const [mounted, setMounted] = useState(false);

  const { videoRef, error, stop } = useWebRTCReceiver({
    host,
    path,
    enabled: open,
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = orig; };
  }, [open]);

  useEffect(() => () => { stop(); }, [stop]);
  useEffect(() => {
    if (open && autoFocusVideo && videoRef.current) {
      videoRef.current.focus();
    }
  }, [open, autoFocusVideo, videoRef]);

  if (!mounted || !open) return null;

  const height = Math.round(width / aspect);

  return (
    <Dialog open={open && mounted} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent title={title || `CCTV / ${path}`} className="w-auto">
        <div
          className="bg-black rounded-md overflow-hidden"
          style={{ width, height }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black outline-none"
            autoPlay
            muted
            playsInline
            controls
          />
        </div>
        {error && (
          <div className="mt-2 px-2 py-1 text-[11px] leading-snug text-red-300 border border-red-400/30 rounded bg-red-900/30 break-all" style={{ maxWidth: width }}>
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CctvDialog;
