import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

export interface CctvModalProps {
  open: boolean;
  url: string;
  title?: string;
  onClose: () => void;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
}

const CctvModal: React.FC<CctvModalProps> = ({
  open,
  url,
  title = 'CCTV',
  onClose,
  autoPlay = true,
  muted = true,
  controls = true,
  poster,
}) => {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const content = useMemo(() => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-[1000]">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
          onClick={onClose}
        />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <h3 className="text-lg font-semibold truncate pr-4">{title}</h3>
              <button
                aria-label="Close"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-300 hover:text-white hover:bg-gray-700/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-video bg-black">
              <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain bg-black"
                controls={controls}
                autoPlay={autoPlay}
                muted={muted}
                playsInline
                poster={poster}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-700">
              <button
                onClick={() => {
                  const v = videoRef.current;
                  if (v) {
                    v.pause();
                    v.currentTime = 0;
                    void v.play().catch(() => {});
                  }
                }}
                className="px-3 py-1.5 text-sm rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700"
              >
                다시 재생
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-sm rounded-md bg-blue-600 hover:bg-blue-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [open, onClose, title, url, controls, autoPlay, muted, poster]);

  if (!mounted) return null;
  const portalTarget = document.getElementById('modal-root') ?? document.body;
  return ReactDOM.createPortal(content, portalTarget);
};

export default CctvModal;
