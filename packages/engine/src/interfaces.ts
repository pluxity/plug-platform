import * as THREE from 'three';

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

/**
 * Poi 데이터
 */
interface PoiData extends PoiCreateOption{
    iconObj?: THREE.Sprite;
}

export {
    CustomLayer,
    MouseButton,
    ModifyKey,
    ModelInfo,
    PoiCreateOption,
    PoiData,
}