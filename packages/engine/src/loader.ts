import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Event from './eventDispatcher';
import * as Interfaces from './interfaces';
import { Engine3D } from './engine';

let engine: Engine3D;
let modelGroup: THREE.Group;

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 배경 모델 그룹 생성
    modelGroup = new THREE.Group();
    modelGroup.name = '#ModelGroup';
    engine.RootScene.add(modelGroup);
});

/**
 * Gltf모델 로드
 * @param url - *.glb 모델링 파일 주소
 * @param onLoad - 로드 완료 후 호출될 콜백함수
 */
function LoadGltf(url: string, onLoad: Function) {
    new Addon.GLTFLoader().load(url, (gltf) => {

        // 객체 그림자 설정
        gltf.scene.traverse((child)=>{
            // 클릭가능한 객체로
            child.layers.enable(Interfaces.CustomLayer.Pickable);

            // 메시 객체면 그림자 설정
            if( child instanceof THREE.Mesh ) {
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });

        // 씬에 추가
        modelGroup.add(gltf.scene);

        // 로드 완료 내부 이벤트 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onGltfLoaded',
            target: gltf.scene,
        });

        // 로드 완료 콜백 호출
        onLoad?.();
    }, undefined, (error: unknown) => console.error(error));
}

export {
    LoadGltf,
}