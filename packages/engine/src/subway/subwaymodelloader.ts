import * as THREE from "three";
import * as Addon from 'three/addons';
import * as Util from '../util';
import { Engine3D } from '../engine';

let engine: Engine3D;
let headModelSrc: THREE.Group;
let bodyModelSrc: THREE.Group;
let tailModelSrc: THREE.Group;

/**
 * 초기화
 */
function initialize(_engine: Engine3D) {
    engine = _engine;
}

/**
 * 메모리 해제
 */
function dispose() {

    disposeSourceModel(headModelSrc);
    disposeSourceModel(bodyModelSrc);
    disposeSourceModel(tailModelSrc);

    headModelSrc = null;
    bodyModelSrc = null;
    tailModelSrc = null;
    engine = null;
}

/**
 * 원본객체 메모리 해제
 */
function disposeSourceModel(target: THREE.Object3D) {

    if (target === undefined || target === null)
        return;

    target.traverse(child => {
        if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
                child.material.forEach(materialItem => {
                    materialItem.map?.dispose();
                    materialItem.dispose();
                });
            } else {
                child.material.map?.dispose();
                child.material.dispose();
            }
        }
    });
}

/**
 * 지하철 열차 머리 모델 로드
 * @param url - 모델링 주소
 * @param onLoad - 로드 완료 후 호출 콜백
 */
function LoadTrainHead(url: string, onLoad: Function) {

    if (!Util.isValidUrl(url))
        return;

    new Addon.GLTFLoader().load(url, (gltf) => {

        headModelSrc = gltf.scene;

        // 이벤트 내부 통지
        engine.EventHandler.dispatchEvent({
            type: 'onSubwayModelLoader_HeadModelLoaded',
            target: headModelSrc
        });

        // 완료 콜백 호출
        onLoad?.();
    });
}

/**
 * 지하철 열차 몸체 모델 로드
 * @param url - 모델링 주소
 * @param onLoad - 로드 완료 후 호출 콜백
 */
function LoadTrainBody(url: string, onLoad: Function) {

    if (!Util.isValidUrl(url))
        return;

    new Addon.GLTFLoader().load(url, (gltf) => {

        bodyModelSrc = gltf.scene;

        // 이벤트 내부 통지
        engine.EventHandler.dispatchEvent({
            type: 'onSubwayModelLoader_BodyModelLoaded',
            target: bodyModelSrc
        });

        // 완료 콜백 호출
        onLoad?.();
    });
}

/**
 * 지하철 열차 꼬리 모델 로드
 * @param url - 모델링 주소
 * @param onLoad - 로드 완료 후 호출 콜백
 */
function LoadTrainTail(url: string, onLoad: Function) {

    if (!Util.isValidUrl(url))
        return;

    new Addon.GLTFLoader().load(url, (gltf) => {

        tailModelSrc = gltf.scene;

        // 이벤트 내부 통지
        engine.EventHandler.dispatchEvent({
            type: 'onSubwayModelLoader_TailModelLoaded',
            target: tailModelSrc
        });

        // 완료 콜백 호출
        onLoad?.();
    });
}

export {
    initialize,
    dispose,

    LoadTrainHead,
    LoadTrainBody,
    LoadTrainTail,
};
