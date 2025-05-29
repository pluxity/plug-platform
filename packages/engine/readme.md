- [Engine3D](./docs/Engine.md)
<!-- Engine3D
=============
## Px.Engine3D(container: HTMLElement)
- WebGL엔진 클래스
- 인스턴스화 하여 사용
```javascript
new Px.Engine3D(containerRef.current);
``` -->

Camera
=============
## Px.Camera.ExtendView(transitionTime: number)
- transitionTime: 이동시간(초)
- 카메라를 배경모델이 어느정도 보이는 각도로 이동시킨다.
- 카메라의 현재 각도를 유지한다.
```javascript
Px.Camera.ExtendView(1.0); // 1초간 이동
```

## Px.Camera.GetState(): object
- 카메라의 현재 상태를 얻는다.
```javascript
const state = Px.Camera.GetState();
console.log(state);
// 출력 예시
// {
//     "position": {
//         "x": -0.801470929798433,
//         "y": 4.550851435900466,
//         "z": -1.1234345885549244
//     },
//     "rotation": {
//         "x": -1.570799242257723,
//         "y": 0.0005416272256549096,
//         "z": 1.5761790599244376
//     }
// }
```

## Px.Camera.SetState(state: Record<string, any>, transitionTime: number)
- state: 카메라 상태 정보(위치, 회전)
- transitionTime: 이동시칸
- 인자값으로 전달받은 상태정보로 카메라를 설정한다
```javascript
const state = {
    "position": {
        "x": -0.801470929798433,
        "y": 4.550851435900466,
        "z": -1.1234345885549244
    },
    "rotation": {
        "x": -1.570799242257723,
        "y": 0.0005416272256549096,
        "z": 1.5761790599244376
    }
};
Px.Camera.SetState(state, 1.0);
```

## Px.Camera.MoveToFloor(floorId: string, transitionTime: number)
- floorId: 층 id값
- transitionTime: 이동시간(초)
- 지정한 층으로 카메라를 이동시킨다.
```javascript
Px.Camera.MoveToFloor('1', 1.0);
```

## Px.Camera.MoveToPoi(id: string, transitionTime: number)
- id: poi id값
- transitionTime: 이동시칸(초)
- id에 해당하는 poi로 카메라를 이동시킨다.
```javascript
Px.Camera.MoveToPoi('TestPoi', 1.0);
```

Loader
=============
## Px.Loader.LoadGltf(url: string, onLoad: Function)
- url: *.glb 모델링 파일 주소
- onLoad: 로드 완료 후 호출될 콜백 함수
- gltf 모델을 로드한다.
- gltf 모델은 층객체가 특정한 속성값을 가지고 있어야 하며, 자세한 사항은 레포지터리의 'funeralhall.glb'파일을 참고 바람.
```javascript
Px.Loader.LoadGltf('funeralhall.glb', () => console.log('모델 로드 완료.'));
```

## Px.Loader.LoadSbm(url: string, onLoad: Function)
- url: *.xml 파일 주소
- onLoad: 로드 완료 후 호출될 콜백 함수
- sbm익스포트시 생성되는 sbm용 *.xml파일로부터 층정보, *.sbm파일등을 읽어 로드한다.
```javascript
Px.Loader.LoadSbm( 'sinlim_station/Sillim_2020_12.xml', ()=>console.log('모델 로드 완료'));
```

Model
=============
## Px.Model.GetModelHierarchy(): ModelInfo[]
- 로드된 모델의 정보를 얻는다.
```javascript
const data = Px.Model.GetModelHierarchy();
console.log(data);
// 출력 예시
// [
//     {
//         "objectName": ".\\Sillim_2020_12_레일_0.sbm/0",
//         "displayName": "레일",
//         "sortingOrder": -1,
//         "floorId": "0"
//     },
//     {
//         "objectName": ".\\Sillim_2020_12_승강장_1.sbm/1",
//         "displayName": "승강장",
//         "sortingOrder": 1,
//         "floorId": "1"
//     },
//     {
//         "objectName": ".\\Sillim_2020_12_대합실_2.sbm/2",
//         "displayName": "대합실",
//         "sortingOrder": 2,
//         "floorId": "2"
//     },
//     {
//         "objectName": ".\\Sillim_2020_12_출구_계단_3.sbm/3",
//         "displayName": "출구_계단",
//         "sortingOrder": 3,
//         "floorId": "3"
//     },
//     {
//         "objectName": ".\\Sillim_2020_12_출구_4.sbm/4",
//         "displayName": "출구",
//         "sortingOrder": 4,
//         "floorId": "4"
//     }
// ]
```

## Px.Model.Expand(transitionTime: number, interval: number, onComplete: Function)
- transitionTime: 이동시간
- interval: 간격(m)
- onComplete: 펼치기 완료 후 호출될 콜백 함수
- 모델 층 펼치기 수행
    - 층 속성중 sortingOrder값 0을 기준으로 펼치기 수행 
```javascript
Px.Model.Expand(1.0, 10.0, () => console.log('펼치기 완료'));
```

## Px.Model.Collapse(transitionTime: number, onComplete: Function)
- transitionTime: 이동시간
- onComplete: 접기 완료 후 호출될 콜백 함수
- 모델 층 접기 수행
```javascript
Px.Model.Collapse(1.0, () => console.log('접기 완료'));
```

## Px.Model.Hide(floorId: string)
- floorId: 숨길 층 id값
- floorId에 해당하는 층을 숨긴다.
```javascript
Px.Model.Hide('1');
```

## Px.Model.HideAll()
- 모든 층 객체를 숨긴다.
```javascript
Px.Model.HideAll();
```

## Px.Model.Show(floorId: string)
- floorId: 보여질 층 id값
- floorId에 해당하는 층을 가시화한다.
```javascript
Px.Model.Show('1');
```

## Px.Model.ShowAll()
- 모든 층 객체를 가시화 한다.
```javascript
Px.Model.ShowAll()
```

Poi
=============
## Px.Poi.Create(option: PoiCreateOption, onComplete?: Function)
- option: 생성 옵션
- onComplete: 생성 완료 후 호출될 콜백 함수
- 전달한 파라미터로 poi배치 작업을 시작한다.(마우스 좌클릭으로 배치 완료)
    - poi의 층id값은 배치완료시 결정
    - 모델은 *.glb파일을 지원
```javascript
const option = {
    "id": "9ecb281f-6638-41f6-8bec-8c8cc4ed094c",
    "iconUrl": "SamplePoiIcon.png",
    "modelUrl": "monkeyhead.glb",
    "displayText": "9ecb281f",
    "property": {
        "testText": "테스트 속성",
        "testInt": 11,
        "testFloat": 2.2
    }
};
Px.Poi.Create(option, (data: unknown) => console.log('Poi.Create Callback', data));
```

## Px.Poi.Delete(id: string)
- id: 제거할 poi id값
- id에 해당하는 poi를 제거한다.
```javascript
Px.Poi.Delete('TestPoi');
```

## Px.Poi.Clear()
- 모든 poi를 제거한다.
```javascript
Px.Poi.Clear();
```

## Px.Poi.Export(id: string)
- id: 익스포트할 poi id값
- id에 해당하는 poi 정보를 얻는다.
```javascript
const data = Px.Poi.Export('TestPoi');
console.log(data);
// 출력 예시
// {
//     "id": "f0839411-a81f-4f9c-94c2-d322219a72e2",
//     "iconUrl": "SamplePoiIcon.png",
//     "modelUrl": "monkeyhead.glb",
//     "displayText": "f0839411",
//     "property": {
//         "testText": "테스트 속성",
//         "testInt": 11,
//         "testFloat": 2.2
//     },
//     "floorId": "2",
//     "position": {
//         "x": -45.489461003413396,
//         "y": -7.349999904632568,
//         "z": -3.2792628759576203
//     },
//     "rotation": {
//         "x": 0,
//         "y": 0,
//         "z": 0
//     },
//     "scale": {
//         "x": 1,
//         "y": 1,
//         "z": 1
//     }
// }
```

## Px.Poi.ExportAll();
- 모든 poi 정보를 얻는다.
```javascript
const data = Px.Poi.ExportAll();
console.log('Poi.ExportAll', data);
```

## Px.Poi.Import(data: PoiImportOption | PoiImportOption[] | string);
- data: poi 임포트 옵션
- poi data로부터 poi를 생성한다.
```javascript
fetch('poiSampleData.json').then(res => res.json()).then(data => {
    console.log('Poi.Import', data);
    Px.Poi.Import(data);
});
```

## Px.Poi.Hide(id: string)
- id: 숨길 poi id값
- id에 해당하는 poi를 숨긴다.
```javascript
Px.Poi.Hide('TestPoi');
```

## Px.Poi.HideAll()
- 모든 poi를 숨긴다.
```javascript
Px.Poi.HideAll();
```

## Px.Poi.Show(id: string)
- id: 가시화할 poi id값
- id에 해당하는 poi를 가시화 한다.
```javascript
Px.Poi.Show('TestPoi');
```

## Px.Poi.ShowAll()
- 모든 poi를 가시화 한다.
```javascript
Px.Poi.ShowAll();
```

## Px.Poi.GetAnimationList()
- id: poi id값
- id에 해당하는 poi가 가지고 있는 애니메이션 목록을 얻는다.
```javascript
const data = Px.Poi.GetAnimationList(this.state.getAnimlistPoiIdValue);
console.log('Px.Poi.GetAnimationList', data);
```

## Px.Poi.PlayAnimation(id: string, animName: string)
- id: poi id값
- animName: 애니메이션 이름
- poi의 애니메이션을 재생한다.
```javascript
Px.Poi.PlayAnimation('TestPoi', 'DoorOpen');
```

## Px.Poi.StopAnimation()
- id: poi id값
- 재생중인 poi의 애니메이션을 중지한다.
```javascript
Px.Poi.StopAnimation('TestPoi');
```

## Px.Poi.StartEdit(id: string, editMode: string)
- id: poi id값
- editMode: 'translate', 'rotate', 'scale' 중 택1
- poi의 위치, 회전, 스케일 편집을 시작한다.
```javascript
Px.Poi.StartEdit('TestPoi', 'translate');
```

## Px.Poi.FinishEdit()
- poi의 편집을 종료한다.
```javascript
Px.Poi.FinishEdit();
```

Event
=============
## Px.Event.AddEventListener(type: string, callback: Function)
- type: 처리할 이벤트명
  - 'onPoiTransformChange': poi 편집시 위치, 회전, 스케일에 값변화가 일어날때 호출
  - 'onPoiPointerUp': poi에 포인터 업 발생할때 호출
- callback: 이벤트에 따라 호출될 콜백 함수
- 형식에 따라 처리할 이벤트를 등록한다.

## Px.Event.RemoveEventListener(type: string, callback: Function)
- type: 제거할 이벤트명
- callback: 제거할 콜백함수
- 형식에 따라 처리하는 이벤트를 제거한다.

Util
=============
## Px.Util.SetBackground(backgroundData: number | string)
- backgroundData: number값(0xff00ff등)의 형식일경우 색상코드로 인식하고, 문자열일경우 이미지 주소로 인식하여 배경을 설정
```javascript
Px.Util.SetBackground(0xff0000); // 색상으로 배경설정
Px.Util.SetBackground('testBackground.png'); // 이미지로 배경설정
```