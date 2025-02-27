import * as THREE from 'three';

/**
 * 데이터 익스포트를 위한 벡터3 클래스
 */
class Vector3Custom extends THREE.Vector3 {
    /**
     * three.js의 vector3 관련 함수를 제거하고 데이터 값만 반환
     * @returns - 좌표값
     */
    get ExportData() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
        };
    }
}

/**
 * 카메라, 픽킹등에 사용할 레이어 열거형
 */
enum CustomLayer {
    Default = 0,
    Invisible,
    Pickable,
}

/**
 * 마우스 버튼 열거형
 */
enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
}

/**
 * 조합키 열거형
 */
enum ModifyKey {
    Shift = 'shiftKey',
    Control = 'ctrlKey',
    Alt = 'altKey',
}

/**
 * 모델 정보
 */
interface ModelInfo {
    objectName: string;
    displayName: string;
    sortingOrder: number;
    floorId: string;
}

/**
 * poi 생성 옵션
 */
interface PoiCreateOption {
    id: string;
    iconUrl: string;
    modelUrl?: string;
    displayText: string;
    property: { [key: string]: any };
}

// /**
//  * Poi 데이터
//  */
// interface PoiData extends PoiCreateOption {
//     position?: Vector3Custom;

//     iconObj?: THREE.Sprite;
//     floorId?: string;
// }

export {
    Vector3Custom,
    CustomLayer,
    MouseButton,
    ModifyKey,
    ModelInfo,
    PoiCreateOption,
    //PoiData,
}