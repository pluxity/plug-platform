import { useEffect, useRef } from 'react';
import * as Px from '@plug/engine/src';

const MapViewer = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Px.Engine3D | undefined>(undefined);

    useEffect(() => {
        if (!containerRef.current || engineRef.current) return;

        const engine = new Px.Engine3D(containerRef.current);
        engineRef.current = engine;

        Px.Loader.LoadGltf('/models/station.glb', () => {
            console.log('모델 로드 완료');
        });

        console.log('WebGL 초기화 완료');
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
