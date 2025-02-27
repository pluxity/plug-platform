import * as THREE from 'three';
import * as Interfaces from '../interfaces';

/**
 * poi 개별요소 클래스
 */
class PoiElement implements Interfaces.PoiCreateOption {

    public id: string;
    public iconUrl: string;
    public modelUrl?: string;
    public displayText: string;
    public property: { [key: string]: any };

    public position?: Interfaces.Vector3Custom;
    private iconObj?: THREE.Sprite;
    private lineHeight: number;

    private floorId?: string;

    /**
     * 생성자
     * @param option - poi 생성 옵션
     */
    constructor(option: Interfaces.PoiCreateOption) {
        // 옵션값
        this.id = option.id;
        this.iconUrl = option.iconUrl;
        this.displayText = option.displayText;
        this.property = option.property;

        this.lineHeight = 2.0;
    }

    /**
     * 아이콘 오브젝트
     */
    set IconObject(value: THREE.Sprite) {
        this.iconObj = value;
    }

    /**
     * 월드 위치 설정
     */
    set WorldPosition(value: THREE.Vector3) {
        // 기준 좌표
        this.position?.copy(value);

        // 아이콘
        this.iconObj?.position.copy(value.clone().addScaledVector(new THREE.Vector3(0, 1, 0), this.lineHeight));
    }

    /**
     * 층 id값
     */
    set FloorId(value: string) {
        this.floorId = value;
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
        };
    }
}

export {
    PoiElement
}