import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import { Engine3D } from '../engine';

let engine: Engine3D;
let modelGroup: THREE.Group;

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 배경 모델 그룹 생성
    modelGroup = new THREE.Group();
    modelGroup.name = '#ModelGroup';
    engine.RootScene.add(modelGroup);
});

function getAsciiString(buffer: ArrayBuffer, offset: number, length: number): string {
    return String.fromCharCode.apply(null, [...new Uint8Array(buffer, offset, length)]);
}

/**
 * *.sbm binary파일로부터 메시 데이터 읽기
 * @param url - *.sbm 파일 주소
 */
async function getSbmMeshData(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    let fileOffset = 0;
    const formatName = getAsciiString(buffer, fileOffset, 8);
    fileOffset += 8;
    console.log(url, ', formatName:', formatName);
}

/**
 * sbm용 xml파일로부터 정보를 읽어 모델을 로드
 * @param urlBase - *.xml파일이 위치한 곳의 *.xml파일명을 제외한 디렉토리 주소
 * @param fileName - sbm용 xml파일명
 * @param onLoad - 로드 완료 후 호출될 콜백 함수
 */
async function LoadSbm(urlBase: string, fileName: string, onLoad: Function) {

    const fullFileUrl = new URL(fileName, urlBase);

    // sbm용 *.xml 데이터 요청
    const response = await fetch(fullFileUrl.href);
    const xmlText = await response.text();
    const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');

    // xml로부터 층정보 읽기
    const floors = xmlDoc.querySelector('Floors') as Element;
    for(let i = 0; i < floors.children.length; i++) {
        // 층
        const floor = floors.children[i];
        // 층정보
        const floorId = floor.getAttribute('id');
        const displayName = floor.getAttribute('name');
        const order = floor.getAttribute('baseFloor');
        
        const fileSource = floor.querySelector('FileSource') as Element;
        const sbmFileName = fileSource.getAttribute('name') as string;

        const sbmFileUrl = new URL(sbmFileName, urlBase).href;
        getSbmMeshData(sbmFileUrl);
        console.log(floorId, ",", displayName, ",", order, ",", sbmFileName);

    }
}

export {
    LoadSbm,
}