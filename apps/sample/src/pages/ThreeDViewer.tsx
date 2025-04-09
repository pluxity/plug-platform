import { useEffect, useRef } from 'react';
import * as Px from '@plug/engine/src';

const ThreeDViewer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            new Px.Engine3D(containerRef.current);
            //Px.Loader.LoadGltf('funeralhall.glb', () => console.log('모델 로드 완료.'));
            Px.Loader.LoadSbm( window.location.origin + '/SBMSample/', 'Untitled.xml', ()=>console.log('모델 로드 완료'));
        }
        console.log('WebGL 초기화 호출.');
    }, []);

    return <div ref={containerRef} className="three-d-viewer-container" style={{
        width: '100%',
        height: 'calc(100vh - 100px)',
    }} />;
};

export default ThreeDViewer;
