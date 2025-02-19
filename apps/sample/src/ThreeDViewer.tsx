import { useEffect, useRef } from 'react';
import { Engine3D } from '@plug/engine/src';

const ThreeDViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      new Engine3D(containerRef.current);
    }
  }, []);

  return <div ref={containerRef} style={{ width: '800px', height: '600px' }} />;
};

export default ThreeDViewer;
