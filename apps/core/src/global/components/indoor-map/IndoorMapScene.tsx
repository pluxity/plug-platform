import React from 'react'
import { IndoorMapViewer } from '@/global/components/indoor-map/MapViewer'
import { FloorControl } from '@/global/components/indoor-map/FloorControl'
import type { Floor } from '@/global/types'

interface IndoorMapSceneProps {
  modelUrl: string
  floors: Floor[]
  onLoadComplete?: () => void
  onOutdoor?: () => void
  overlays?: React.ReactNode
  className?: string
}

export const IndoorMapScene: React.FC<IndoorMapSceneProps> = ({ modelUrl, floors, onLoadComplete, onOutdoor, overlays, className = 'w-full h-full relative' }) => {
  return (
    <div className={className}>
      <IndoorMapViewer modelUrl={modelUrl} onLoadComplete={onLoadComplete} onDispose={engine => (engine as unknown as { clear?: () => void })?.clear?.()} />
      {overlays}
      {floors.length > 0 && (
        <div className='absolute bottom-6 right-6 z-20 max-w-xs'>
          <FloorControl floors={floors} />
        </div>
      )}
      {onOutdoor && (
        <button onClick={onOutdoor} className='absolute top-4 right-4 z-20 rounded-xl px-4 py-3 text-white cursor-pointer select-none bg-gradient-to-r from-sky-600 to-cyan-600 shadow-lg shadow-cyan-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-300/70 pointer-events-auto' title='실외 지도로 나가기' aria-label='실외 지도로 나가기' role='button' style={{ zIndex: 60 }}>
          <div className='flex items-center space-x-3'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2} aria-hidden>
              <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
            <span className='text-base font-medium'>실외로 나가기</span>
          </div>
        </button>
      )}
    </div>
  )
}

export default IndoorMapScene
