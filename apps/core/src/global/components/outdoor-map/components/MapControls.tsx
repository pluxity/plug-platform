import { flyToHome } from '../lib/cameraSettings';

import React from 'react';
import { useCesium } from 'resium';

import { MinusIcon, PlusIcon, HomeIcon } from 'lucide-react';

const MapControls: React.FC = () => {
  const { viewer } = useCesium();

  const handleZoom = (dir: 1 | -1) => {
    if (!viewer) return;
    const cam = viewer.scene.camera;
    const h = cam.positionCartographic.height;
    cam.move(cam.direction, h * 0.1 * dir);
  };

  const handleHome = () => {
    if (viewer) {
      flyToHome(viewer, { duration: 1.5 });
    }
  };

  return (
    <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
      {/* 범용 liquid-glass 컨테이너 */}
      <div className="liquid-glass flex flex-col gap-3 p-3">
        {/* 확대 버튼 */}
        <button
          onClick={() => handleZoom(1)}
          title="확대"
          className="liquid-glass w-11 h-11 rounded-lg flex items-center justify-center"
        >
          <PlusIcon className="w-5 h-5 text-white/90 hover:text-white transition-colors" />
        </button>

        {/* 축소 버튼 */}
        <button
          onClick={() => handleZoom(-1)}
          title="축소"
          className="liquid-glass w-11 h-11 rounded-lg flex items-center justify-center"
        >
          <MinusIcon className="w-5 h-5 text-white/90 hover:text-white transition-colors" />
        </button>

        {/* 구분선 */}
        <div className="h-px bg-white/15 mx-2" />

        {/* 홈 버튼 */}
        <button
          onClick={handleHome}
          title="홈으로 이동"
          className="liquid-glass w-11 h-11 rounded-lg flex items-center justify-center"
        >
          <HomeIcon className="w-5 h-5 text-white/90 hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default MapControls;
