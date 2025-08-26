[목록으로](../readme.md)
============
Engine3D
=============
## Px.Core.Initialize(container: HTMLElement)
- WebGL엔진 클래스
- 인스턴스화 하여 사용
```javascript
// new Px.Engine3D(containerRef.current);

// 초기화
const container = document.getElementById('webglContainer');
Core.Initialize(container); // WebGL 초기화
```

## Px.Core.Dispose()
- WebGL 메모리 해제
```javascript
Core.Dispose();
```