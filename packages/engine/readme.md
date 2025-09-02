- [Engine3D](./docs/Engine3D.md)
- [Camera](./docs/Camera.md)
- [Loader](./docs/Loader.md)
- [Model](./docs/Model.md)
- [Poi](./docs/Poi.md)
- [Event](./docs/Event.md)
- [Util](./docs/Util.md)
- [Path3D](./docs/Path3D.md)
- [Effect](./docs/Effect.md)
- [Subway](./docs/Subway.md)
- [Label3D](./docs/Label3D.md)
- [Interfaces](./docs/Interfaces.md)

업데이트 내역
============
# 2025-09-02
- [Engine](./docs/Engine3D.md#pxcoreresize) WebGL 캔버스 Resize Api 추가
- [Poi](./docs/Poi.md) Poi 선관련 Api 제거
  - HideAllLine, HideLine, ShowAllLine, ShowLine
- [Poi](./docs/Poi.md) Poi DisplayText관련 명칭 수정
  - [ShowDisplayText->ShowHtmlObject](./docs/Poi.md#showhtmlobjectid-string)
  - [ShowAllDisplayText->ShowAllHtmlObject](./docs/Poi.md#showallhtmlobject)
  - [HideDisplayText->HideHtmlObject](./docs/Poi.md#hidehtmlobjectid-string)
  - [HideAllDisplayText->HideAllHtmlObject](./docs/Poi.md#hideallhtmlobject)
- [Poi](./docs/Poi.md) 마우스 입력 처리 수정
- [Poi](./docs/Poi.md#pxpoistartediteditmode-string) Poi 편집 모드 기능 개선
- [Effect](./docs/Effect.md) 효과(외각선) Api 추가
- [Interfaces](./docs/Interfaces.md#outlineoptions) 외각선 옵션 인터페이스 추가
- [Interfaces](./docs/Interfaces.md#poicreateoption) PoiCreateOption, displayText 명칭 수정
- [Interfaces](./docs/Interfaces.md#poiimportoption) PoiImportOption, displayText 명칭 수정
- [Camera](./docs//Camera.md#pxcameramovetopoiid-string-transitiontime-number-offset-interfacesvector3) MoveToPoi 최종위치 offset 파라미터 추가

# 2025-08-28
- [Poi](./docs/Poi.md) SetDisplayText 함수 제거
- [Poi](./docs/Poi.md#settextinnerhtmlid-string-htmlstring-string) SetTextInnerHtml 함수 추가
- [Camera](./docs/Camera.md) 포인터 이벤트 좌표 처리 방식 수정

# 2025-08-26
- [Engine3D](./docs/Engine3D.md) 엔진 초기화 호출부 수정 및 메모리 해제 함수 추가
```javascript
import { Core } from '@plug/engine';

// 초기화
const container = document.getElementById('webglContainer');
Core.Initialize(container); // WebGL 초기화

// 메모리 해제
// 메모리 해제시 WebGL 초기화떄 생성되는 Canvas까지 제거됨(Canvas를 포함하는 컨테이너는 제거X)
Core.Dispose();
```
- [Poi](./docs/Poi.md) 아이콘 URL 유효성 체크 제외
- [Event](./docs/Event.md#pxeventaddeventlistenertype-string-callback-function) Poi 편집 완료 이벤트 처리 추가

# 2025-06-17
- [Path3D](./docs/Path3D.md) Api 문서 추가
- [Subway](./docs/Subway.md) Api 문서 추가
- [Label3D](./docs/Label3D.md) Api 문서 추가
- [Interfaces](./docs/Interfaces.md) Api 문서 추가
- [Camera](./docs/Camera.md) 수정사항
  - [Poi로 카메라 이동](./docs/Camera.md#pxcameramovetopoiid-string-transitiontime-number)시 바운딩 정보, Poi 방향 적용
- [Poi](./docs/Poi.md) 수정사항
  - Poi생성시 라인, 아이콘, 텍스트등에 메시 객체 바운딩 높이 적용
  - [Poi 편집 시작](./docs/Poi.md#pxpoistartediteditmode-string) 함수 id파라미터 제거(호출 후 마우스 클릭으로 편집할 객체 선택)
- [Event](./docs/Event.md) 수정사항
  - Label3D 이벤트 콜백 추가
    - 'onLabel3DTransformChange': Label3D 편집시 호출
    - 'onLabel3DPointerUp': Label3D 포인터 업 이벤트 발생시 호출

# 2025-06-04
- Poi 선 가시화 On/Off
  - [Px.Poi.ShowLine](./docs/Poi.md#pxpoishowlineid-string)
  - [Px.Poi.HideLine](./docs/Poi.md#pxpoihidelineid-string)
  - [Px.Poi.ShowAllLine](./docs/Poi.md#pxpoishowallline)
  - [Px.Poi.HIdeAllLine](./docs/Poi.md#pxpoihideallline)
- Poi 표시명 텍스트 가시화 On/Off
  - [Px.Poi.ShowDisplayText](./docs/Poi.md#showdisplaytextid-string)
  - [Px.Poi.HideDisplayText](./docs/Poi.md#hidedisplaytextid-string)
  - [Px.Poi.ShowAllDisplayText](./docs/Poi.md#showalldisplaytext)
  - [Px.Poi.HideAllDisplayText](./docs/Poi.md#hidealldisplaytext)
- Poi 표시명 텍스트 변경
  - [Px.Poi.SetDisplayText](./docs/Poi.md#setdisplaytextid-string-text-string)