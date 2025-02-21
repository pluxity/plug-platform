import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Interfaces from './interfaces';

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

export {
    GetModelHierarchy,
}