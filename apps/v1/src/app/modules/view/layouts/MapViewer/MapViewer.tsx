import { useEffect, useRef } from 'react';
import * as Px from '@plug/engine/src';
import type { MapViewerProps } from './types';

const MapViewer = ({ modelPath, onModelLoaded, onLoadError }: MapViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const engineRef = useRef<any>(null);

    useEffect(() => {
        if (containerRef.current && !engineRef.current) {
            engineRef.current = new Px.Engine3D(containerRef.current);
            console.log('WebGL 엔진 초기화 완료');
        }
    }, []);

    useEffect(() => {
        if (engineRef.current && modelPath) {
            try {
                Px.Loader.LoadGltf(modelPath, () => {
                    onModelLoaded?.();
                });
            } catch (error) {
                onLoadError?.(error as Error);
            }
        }
    }, [modelPath, onModelLoaded, onLoadError]);

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
