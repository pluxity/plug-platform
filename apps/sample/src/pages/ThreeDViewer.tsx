import { useEffect, useRef } from 'react';
import { Engine3D, Loader } from '@plug/engine/src';

const ThreeDViewer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    let engine: Engine3D | null = null;

    const c2 = useRef<HTMLDivElement>(null);
    // 엔진 메모리 해제 테스트용
    window.addEventListener('keydown', (evt: KeyboardEvent) => {
        if (evt.key === 'q') {
            (engine as Engine3D).dispose();
            engine = null;
            console.log('WebGL 엔진 메모리 해제 완료.');
        } else if (evt.key === 'w') {
            if (c2.current) {
                engine = new Engine3D(c2.current);
                Loader.LoadGltf('Seomyeun_250611.glb', () => console.log('모델 로드 완료.'));
                console.log('WebGL 재 초기화 호출.');
            }
        }
    });

    useEffect(() => {
        if (containerRef.current) {
            engine = new Engine3D(containerRef.current);
            Loader.LoadGltf('Seomyeun_250611.glb', () => console.log('모델 로드 완료.'));
        }
        console.log('WebGL 초기화 호출.');
    }, []);

    // return <div ref={containerRef} className="three-d-viewer-container" style={{ width: '100%', height: '1000px' }} />;
    return <span><div ref={containerRef} className="three-d-viewer-container" style={{ width: '100%', height: '1000px' }} /><div ref={c2} className="three-d-viewer-container" style={{ width: '100%', height: '1000px' }}></div></span>;
};

export default ThreeDViewer;
