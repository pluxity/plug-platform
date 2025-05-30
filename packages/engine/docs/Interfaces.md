[목록으로](../readme.md)
============
Interfaces
============
## ModelInfo
```javascript
/**
 * 모델 정보
 */
interface ModelInfo {
    objectName: string; // 객체 이름
    displayName: string; // 표시명
    sortingOrder: number; // 정렬 순서
    floorId: string; // 층 id값
}
```

## PoiCreateOption
```javascript
/**
 * poi 생성 옵션
 */
interface PoiCreateOption {
    id: string; // poi id값
    iconUrl: string; // 아이콘 이미지 주소
    modelUrl?: string; // 모델링 파일 주소
    displayText: string; // 표시명 텍스트
    property: { [key: string]: any }; // 속성
}
```

## PoiImportOption
```javascript
/**
 * poi 임포트 옵션
 */
interface PoiImportOption {
    id: string; // poi id값
    iconUrl: string; // 아이콘 이미지 주소
    modelUrl?: string; // 모델링 파일 주소
    displayText: string; // 표시명 텍스트
    floorId: string; // poi가 배치된 층 id값
    property: { [key: string]: any }; // 속성
    position: Vector3Custom; // 위치 x,y,z
    rotation: EulerCustom; // 회전 x,y,z
    scale: Vector3Custom; // 스케일 x,y,z
}
// 사용 예시
Px.Poi.Import({
    "id": "ff8419ab-0b64-40a4-bfc2-0f3b317e0b2e",
    "iconUrl": "SamplePoiIcon.png",
    "modelUrl": "monkeyhead.glb",
    "displayText": "ff8419ab",
    "property": {
        "testText": "테스트 속성",
        "testInt": 11,
        "testFloat": 2.2
    },
    "floorId": "4",
    "position": {
        "x": -11.168609758648447,
        "y": 0.19880974292755127,
        "z": -2.6205250759845735
    },
    "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
    },
    "scale": {
        "x": 1,
        "y": 1,
        "z": 1
    }
});
```