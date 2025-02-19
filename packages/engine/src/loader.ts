import * as THREE from 'three';
import * as Addon from 'three/addons';

/**
 * Gltf모델 로드
 * @param url - *.glb 모델링 파일 주소
 * @param onLoad - 로드 완료 후 호출될 콜백함수
 */
function LoadGltf(url: string, onLoad: Function) {
    new Addon.GLTFLoader().load(url, (gltf) => {

        // 로드 완료 콜백 호출
        onLoad?.();
    }, undefined, (error: unknown) => console.error(error));
}

export {
    LoadGltf,
}