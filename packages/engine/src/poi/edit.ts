import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as PoiData from './data';
import * as Camera from '../camera';
import { Engine3D } from '../engine';
import { PoiElement } from './element';

let engine: Engine3D;
let target: PoiElement;

let gizmo: Addon.TransformControls;
let previewObject: THREE.Object3D;

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;
});

async function StartEdit(id: string, editMode: string) {
    if (!PoiData.exists(id)) {
        console.warn('편집할 poi를 찾지 못함.');
        return;
    }

    // 편집 대상 poi의 modelUrl을 기준으로 편집용 임시 객체를 생성한다.
    target = PoiData.getPoiElement(id);
    if (target.modelUrl !== undefined) {
        const loader = new Addon.GLTFLoader();
        const gltf = await loader.loadAsync(target.modelUrl);

        // 현재 poi의 상태를 적용
        previewObject = gltf.scene;
        engine.RootScene.add(previewObject);

        previewObject.position.copy(target.position);
        previewObject.rotation.copy(target.PointMeshData.rotation);
        previewObject.scale.copy(target.PointMeshData.scale);
    } else {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 'red' });
        previewObject = new THREE.Mesh(geometry, material);
        engine.RootScene.add(previewObject);

        previewObject.position.copy(target.position);
        previewObject.rotation.copy(target.PointMeshData.rotation);
        previewObject.scale.copy(target.PointMeshData.scale);
    }

    // 기즈모 생성
    gizmo = new Addon.TransformControls(engine.Camera, engine.Renderer.domElement);
    gizmo.addEventListener('dragging-changed', (event) => {
        Camera.SetEnabled(!event.value);
    });

    gizmo.attach(previewObject);

    const helper = gizmo.getHelper();
    engine.RootScene.add(helper);
}

function CancelEdit() {

}

function FinishEdit() {

}

export {
    StartEdit,
    CancelEdit,
    FinishEdit,
}