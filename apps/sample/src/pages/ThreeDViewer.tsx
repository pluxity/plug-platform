import { useEffect, useRef } from 'react';
import { Core, Loader } from '@plug/engine';

const ThreeDViewer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    // 엔진 메모리 해제 테스트용
    window.addEventListener('keydown', (evt: KeyboardEvent) => {
        if (evt.key === 'q') {
            Core.Dispose();
            console.log('WebGL 엔진 메모리 해제 완료.');
        } else if (evt.key === 'w') {
            Core.Initialize(containerRef.current as HTMLElement);
            Loader.LoadGltf('yongsan.glb', () => console.log('모델 로드 완료.'));
            console.log('WebGL 재 초기화 호출.');
        }
    });

    useEffect(() => {
        if (containerRef.current) {
            Core.Initialize(containerRef.current);
            Loader.LoadGltf('yongsan.glb', () => console.log('모델 로드 완료.'));
        }
        console.log('WebGL 초기화 호출.');
    }, []);

    return <div ref={containerRef} className="three-d-viewer-container" style={{ width: '100%', height: '1000px', position: 'relative' }} />;
};

export default ThreeDViewer;
