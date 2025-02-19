import { useEffect, useRef } from 'react';
import { Engine3D } from '@plug/engine/src';

const ThreeDViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      new Engine3D(containerRef.current);
    }
    console.log('WebGL 초기화 호출.');
  }, []);

  return <div ref={containerRef} style={{ left: '0px', top: '0px', width: '100vw', height: '100vh' }} />;
};

export default ThreeDViewer;
