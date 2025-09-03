[목록으로](../readme.md)
============
Effect
=============
## Px.Effect.Outline.SetPoiOutline(id: string | string[])
- id: 외각선 설정할 Poi id값 혹은 id값배열
- poi 외각선 설정
```javascript
Px.Effect.Outline.SetPoiOutline('TestPoi');

Px.Effect.Outline.SetPoiOutline(['TestPoi', 'TestPoi2']);
```

## Px.Effect.Outline.Clear()
- 설정한 외각선 전부 제거
```javascript
Px.Effect.Outline.Clear();
```

## Px.Effect.Outline.SetOutlineOptions(option: [OutlineOptions](./Interfaces.md#outlineoptions))
- option: 외각선 옵션값
- 외각선 옵션 설정
```javascript
Px.Effect.Outline.SetOutlineOptions({
    edgeStrength: 20.0,
    pulsePeriod: 0.5,
    visibleEdgeColor: 0xff0000
});
```

