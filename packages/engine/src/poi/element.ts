import * as THREE from 'three';
import * as Interfaces from '../interfaces';
import * as Event from '../eventDispatcher';

/**
 * poi 개별요소 클래스
 */
class PoiElement implements Interfaces.PoiCreateOption {

    public id: string;
    public iconUrl: string;
    public modelUrl?: string;
    public displayText: string;
    public property: { [key: string]: any };

    public position: Interfaces.Vector3Custom;
    private iconObj?: THREE.Sprite;
    private textObj?: THREE.Object3D;
    private lineHeight: number;

    private floorId?: string;
    
    private pointMeshData: PoiPointMeshData;

    /**
     * 생성자
     * @param option - poi 생성 옵션
     */
    constructor(option: Interfaces.PoiCreateOption) {
        // 옵션값
        this.id = option.id;
        this.modelUrl = option.modelUrl;
        this.iconUrl = option.iconUrl;
        this.displayText = option.displayText;
        this.property = option.property;

        this.position = new Interfaces.Vector3Custom();
        this.lineHeight = 2.0;

        this.pointMeshData = {
            meshRef: undefined,
            instanceIndex: -1,
            rotation: new Interfaces.EulerCustom,
            scale: new Interfaces.Vector3Custom(1, 1, 1),
        };
    }

    /**
     * 아이콘 오브젝트
     */
    set IconObject(value: THREE.Sprite) {
        this.iconObj = value;
    }

    /**
     * 텍스트 오브젝트
     */
    set TextObject(value: THREE.Object3D) {
        this.textObj = value;
    }

    /**
     * 월드 위치 설정
     */
    set WorldPosition(value: THREE.Vector3) {
        // 기준 좌표
        this.position?.copy(value);

        // 아이콘
        this.iconObj?.position.copy(value.clone().addScaledVector(new THREE.Vector3(0, 1, 0), this.lineHeight));

        // 텍스트
        this.textObj?.position.copy(value.clone().addScaledVector(new THREE.Vector3(0, 1, 0), this.lineHeight));
    }

    /**
     * 월드 위치
     */
    get WorldPosition(): THREE.Vector3 {
        return this.position;
    }

    /**
     * 층 id값
     */
    set FloorId(value: string) {
        this.floorId = value;
    }

    /**
     * 선길이
     */
    get LineHeight(): number {
        return this.lineHeight;
    }

    /**
     * 위치점 메시 데이터
     */
    get PointMeshData(): PoiPointMeshData {
        return this.pointMeshData;
    }

    /**
     * poi 데이터
     */
    get ExportData() {
        return {
            id: this.id,
            iconUrl: this.iconUrl,
            modelUrl: this.modelUrl,
            displayText: this.displayText,
            property: this.property,
            floorId: this.floorId,
            position: this.position?.ExportData,
            rotation: this.pointMeshData.rotation.ExportData,
            scale: this.pointMeshData.scale.ExportData,
        };
    }

    /**
     * poi 요소 제거 및 메모리 해제
     */
    dispose() {
        // 아이콘 제거
        this.iconObj?.parent?.remove(this.iconObj);

        // 텍스트 제거
        this.textObj?.parent?.remove(this.textObj);
        ((this.textObj as THREE.Mesh).material as THREE.MeshBasicMaterial).map?.dispose();
        ((this.textObj as THREE.Mesh).material as THREE.MeshBasicMaterial).dispose();

        // 내부 이벤트 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onPoiElementDisposed',
            id: this.id,
        });
    }
}

/**
 * poi 위치점 메시 데이터
 */
interface PoiPointMeshData {
    meshRef: THREE.InstancedMesh | undefined;
    instanceIndex: number;
    rotation: Interfaces.EulerCustom;
    scale: Interfaces.Vector3Custom;
}

export {
    PoiElement,
    PoiPointMeshData,
}