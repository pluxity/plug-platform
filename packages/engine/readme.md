Engine3D
=============
## Px.Engine3D(container: HTMLElement)
- WebGL엔진 클래스
- 인스턴스화 하여 사용
```javascript
new Px.Engine3D(containerRef.current);
```

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
Px.Camera.MoveToFloor
Px.Camera.MoveToPoi
Px.Camera.SetEnabled
Px.Camera.SetState

Px.Loader.LoadGltf
Px.Loader.LoadSbm

Px.Model.Collapse
Px.Model.Expand
Px.Model.GetModelHierarchy
Px.Model.Hide
Px.Model.HideAll
Px.Model.Show
Px.Model.ShowAll

Px.Poi.Clear
Px.Poi.Create
Px.Poi.Delete
Px.Poi.Export
Px.Poi.ExportAll
Px.Poi.GetAnimationList
Px.Poi.Hide
Px.Poi.HideAll
Px.Poi.Import
Px.Poi.PlayAnimation
Px.Poi.Show
Px.Poi.ShowAll
Px.Poi.StopAnimation