import React from 'react'
import { useCesium } from 'resium'
import { Button } from '@plug/ui'
import { flyToHome } from './camera-settings'

type MapControlsProps = Record<string, never>

const MapControls: React.FC<MapControlsProps> = () => {
  const { viewer } = useCesium()

  const fnZoomIn = () => {
  if (!viewer) return
  const camera = viewer.scene.camera
  const direction = camera.direction
  const moveDistance = camera.positionCartographic.height * 0.1
  camera.move(direction, moveDistance)
  };

  const fnZoomOut = () => {
  if (!viewer) return
  const camera = viewer.scene.camera
  const direction = camera.direction
  const moveDistance = camera.positionCartographic.height * -0.1
  camera.move(direction, moveDistance)
  };

  const fnFlyToHome = () => flyToHome(viewer!, { duration: 1.5 })

  const btnClassName = 'hover:bg-transparent text-gray-100 hover:text-gray-800 cursor-pointer w-9 h-9 hover:scale-150 transition-transform duration-200 rounded-full flex items-center justify-center'

  return (
  <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-1.5 z-10 p-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
      <Button
        onClick={fnZoomIn}
        variant="ghost"
        size="icon"
        title="확대"
        className={btnClassName}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </Button>
      <Button
        onClick={fnZoomOut}
        variant="ghost"
        size="icon"
        title="축소"
        className={btnClassName}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </Button>
      <Button
        onClick={fnFlyToHome}
        variant="ghost"
        size="icon"
        title="홈 화면"
        className={btnClassName}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      </Button>
    </div>
  );
};

export default MapControls;
