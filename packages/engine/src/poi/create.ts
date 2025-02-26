import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Interfaces from '../interfaces';
import * as Event from '../eventDispatcher';
import { Engine3D } from '../engine';

let poiRootGroup: THREE.Group;
let iconGroup: THREE.Group;
const iconStorage: Record<string, THREE.SpriteMaterial> = {};

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {

    const engine: Engine3D = evt.engine as Engine3D;

    // poi 최상위 루트 그룹
    poiRootGroup = new THREE.Group();
    poiRootGroup.name = '#PoiRootGroup';
    engine.RootScene.add(poiRootGroup);

    // 아이콘 그룹
    iconGroup = new THREE.Group();
    iconGroup.name = '#IconGroup';
    poiRootGroup.add(iconGroup);
});

/**
 * poi 생성
 * @param option - poi 생성 옵션
 */
function Create(option: Interfaces.PoiCreateOption, onComplete?: Function) {
    /*
    interface PoiCreateOption {
        id: string;
        iconUrl: string;
        modelUrl?: string;
        displayText: string;
        property: { [key: string]: any };
    }
        
    interface PoiData extends PoiCreateOption{
        iconObj?: THREE.Sprite;
    }
    */
    // 중복 체크

    // 아이콘 재질이 로드된 상태가 아니면 로드
    if (iconStorage.hasOwnProperty(option.iconUrl) === false) {
        iconStorage[option.iconUrl] = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load(option.iconUrl),
            sizeAttenuation: false,
            toneMapped: false,
        });
    }

    // poi용 아이콘 스프라이트 생성
    const iconObj = new THREE.Sprite(iconStorage[option.iconUrl]);
    iconObj.center.set(0.5, 0.0);
    iconObj.scale.setScalar(0.05);
    iconGroup.add(iconObj);

    // 텍스트 생성

    // poi 데이터 속성 설정
    const poiData: Interfaces.PoiData = option;
    poiData.position = new Interfaces.Vector3Custom();
    poiData.iconObj = iconObj;

    // poi 생성 이벤트 내부 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onPoiCreate',
        target: poiData,
        onCompleteCallback: onComplete,
    });
}

export {
    Create,
}