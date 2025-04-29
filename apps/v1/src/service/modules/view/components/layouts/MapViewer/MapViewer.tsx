import { useEffect, useRef } from 'react';
import * as Px from '@plug/engine/src';

const MapViewer = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            new Px.Engine3D(containerRef.current);
            Px.Loader.LoadGltf('/models/station.glb', ()=> console.log('sbm->glb 테스트'));
        }
        console.log('WebGL 초기화 호출.');
    }, []);

    return (
        <div className="engine absolute inset-0 bg-green-500 z-0">
            <div
                ref={containerRef}
                className="three-d-viewer-container"
                style={{
                    width: '100%',
                    height: '100vh',
                }}
            />
        </div>
    );
};

export default MapViewer;
