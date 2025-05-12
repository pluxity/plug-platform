import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Interfaces from './interfaces';
import * as Event from './eventDispatcher';

const floorObjects: Record<string, THREE.Object3D> = {};


/**
 * gltf 로드 완료후 콜백 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onGltfLoaded' as never, (evt: any) => {
    // gltf 모델 로드 완료후 층객체만 따로 저장
    const target: THREE.Object3D = evt.target;
    target.traverse(child => {
        if (child.userData.hasOwnProperty('type')) {
            const type: string = child.userData['type'];
            if (type.toLowerCase() === 'floor')
                floorObjects[child.userData.floorId] = child;
        }
    });
});

/**
 * 자식을 포함한 대상의 모든 객체에 대해 레이어를 설정
 * @param target - 대상 객체
 */
function setObjectLayer(target: THREE.Object3D, layer: Interfaces.CustomLayer) {
    target.traverse(child => {
        child.layers.disableAll();
        child.layers.set(layer);
    });
}

/**
 * 모델구조 얻기
 * @param url - 모델링 url 주소
 * @param onComplete - 완료 후 호출될 콜백 함수
 */
function GetModelHierarchy(url: string, onComplete: Function) {

    new Addon.GLTFLoader().load(url, (gltf) => {

        const result: Interfaces.ModelInfo[] = [];

        // 구조 분석
        gltf.scene.traverse(child => {
            if (child.userData.hasOwnProperty('type')) {
                const type: string = child.userData['type'];
                if (type.toLowerCase() === 'floor') {
                    const info: Interfaces.ModelInfo = {
                        objectName: child.name,
                        displayName: child.userData.displayName,
                        sortingOrder: Number.parseInt(child.userData.sortingorder),
                        floorId: child.userData.floorId
                    };

                    // 배열에 저장
                    result.push(info);
                }
            }
        });

        // 콜백 호출
        onComplete?.(result);

    }, undefined, (err) => console.error(err));
}

/**
 * 층객체 보기
 * @param id - 층객체 id값
 */
function Show(id: string) {
    if (floorObjects.hasOwnProperty(id)) {
        floorObjects[id].visible = true;
        setObjectLayer(floorObjects[id], Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable);
    }
}

/**
 * 층객체 숨기기
 * @param id - 층객체 id값
 */
function Hide(id: string) {
    if (floorObjects.hasOwnProperty(id)) {
        floorObjects[id].visible = false;
        setObjectLayer(floorObjects[id], Interfaces.CustomLayer.Invisible);
    }
}

/**
 * 모든 층객체 보기
 */
function ShowAll() {
    Object.values(floorObjects).forEach(floor => {
        floor.visible = true;
        setObjectLayer(floor, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable);
    });
}

/**
 * 모든 층객체 숨기기
 */
function HideAll() {
    Object.values(floorObjects).forEach(floor => {
        floor.visible = false;
        setObjectLayer(floor, Interfaces.CustomLayer.Invisible);
    });
}

export {
    GetModelHierarchy,
    Show,
    Hide,
    ShowAll,
    HideAll,
}