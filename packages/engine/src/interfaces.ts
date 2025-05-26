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
 * 데이터 익스포트를 위한 Euler 클래스
 */
class EulerCustom extends THREE.Euler {
    get ExportData() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
        }
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

/**
 * poi 임포트 옵션
 */
interface PoiImportOption {
    id: string;
    iconUrl: string;
    modelUrl?: string;
    displayText: string;
    floorId: string;
    property: { [key: string]: any };
    position: Vector3Custom;
    rotation: EulerCustom;
    scale: Vector3Custom;
}

/**
 * Sbm 파일 헤더 정보
 */
interface SBMHeader {
    formatName: string;
    version: number;
    materialCount: number;
    meshCount: number;
}

/**
 * SBM 재질 정보
 */
interface SBMMaterial {
    id: number;
    ambient: THREE.Color;
    diffuse: THREE.Color;
    opacity: number;
    specular: THREE.Color;
    facing: number;
    textureMapPath: string;
}

/**
 * SBM 메시 정보
 */
interface SBMMesh {
    id: number;
    usedMaterialId: number;

    vertexCount: number;
    posVertices: number[];
    normVertices: number[];
    uvVertices : number[];
    indices: number[];
}

/**
 * Path3D 세그먼트 데이터 인터페이스
 */
interface Path3DSegmentData {
    start: Vector3Custom;
    control: Vector3Custom;
    end: Vector3Custom;
}

/**
 * Path3D 데이터 인터페이스
 */
interface Path3DData {
    id: string;
    color: THREE.ColorRepresentation;
    segments: Path3DSegmentData[];
}

export {
    Vector3Custom,
    EulerCustom,
    CustomLayer,
    MouseButton,
    ModifyKey,
    ModelInfo,
    PoiCreateOption,
    PoiImportOption,
    SBMHeader,
    SBMMaterial,
    SBMMesh,
    Path3DSegmentData,
    Path3DData,
}