# Facility 등록 모달 사용 가이드

## 개요

FacilityType에 따라 동적으로 폼이 변경되는 Facility 등록 모달입니다. Common-Service의 domain-config를 기반으로 각 시설 유형별로 필요한 DataComponent를 자동으로 렌더링합니다.

## 주요 특징

1. **동적 폼 생성**: FacilityType 선택에 따라 필요한 입력 폼이 자동으로 표시/숨김
2. **타입 안전성**: TypeScript로 타입 안전성 보장
3. **재사용 가능한 컴포넌트**: 각 DataComponent별로 분리된 폼 컴포넌트
4. **유효성 검사**: Zod 스키마를 사용한 강력한 유효성 검사

## 지원하는 시설 유형

### 1. Building (건물)
- **포함 컴포넌트**: facility, floors
- **입력 필드**:
  - 기본 정보: 시설명, 시설 코드, 설명, 위치 정보
  - 층 정보: 층 이름, 층 ID (다중 입력 가능)

### 2. Station (역사)
- **포함 컴포넌트**: facility, floors, stationInfo
- **입력 필드**:
  - 기본 정보: 시설명, 시설 코드, 설명, 위치 정보
  - 층 정보: 층 이름, 층 ID (다중 입력 가능)
  - 역사 정보: 역 코드, 노선 ID (각각 다중 입력 가능)

### 3. Park (공원)
- **포함 컴포넌트**: facility, boundary
- **입력 필드**:
  - 기본 정보: 시설명, 시설 코드, 설명, 위치 정보
  - 경계 정보: GeoJSON 형식의 경계 데이터

## 컴포넌트 구조

```
facility/
├── types/
│   ├── form.ts                      # TypeScript 타입 정의
│   └── index.ts                     # export 관리
├── components/
│   ├── CreateFacilityModal.tsx      # 메인 모달 컴포넌트
│   └── form-components/
│       ├── FacilityFormComponent.tsx    # 기본 정보 입력 폼
│       ├── FloorsFormComponent.tsx      # 층 정보 입력 폼
│       ├── StationInfoFormComponent.tsx # 역사 정보 입력 폼
│       ├── BoundaryFormComponent.tsx    # 경계 정보 입력 폼
│       └── index.ts                     # export 관리
└── page/
    └── FacilityList.tsx             # 모달 사용 예시
```

## 사용 방법

### 1. 기본 사용법

```tsx
import { CreateFacilityModal } from '@/backoffice/domains/facility/components';
// 또는
import { CreateFacilityModal } from '@/backoffice/domains/facility';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = (facilityId: number) => {
    console.log('새 시설이 생성되었습니다. ID:', facilityId);
    // 필요한 후처리 로직 (데이터 새로고침 등)
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        새 시설 추가
      </Button>
      
      <CreateFacilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
```

### 2. Props 설명

| Prop | Type | 설명 |
|------|------|------|
| `isOpen` | `boolean` | 모달 열림/닫힘 상태 |
| `onClose` | `() => void` | 모달 닫기 콜백 |
| `onSuccess` | `(facilityId: number) => void` | 시설 생성 성공 시 콜백 |

## 동작 원리

1. **시설 유형 선택**: 사용자가 드롭다운에서 시설 유형 선택
2. **동적 폼 렌더링**: domain-config에 정의된 components 배열을 기반으로 해당 시설 유형에 필요한 폼 컴포넌트들을 동적으로 렌더링
3. **데이터 수집**: 각 폼 컴포넌트에서 입력된 데이터를 수집
4. **API 요청**: FacilityService.create()를 통해 선택된 도메인에 맞는 엔드포인트로 요청 전송

## 확장 방법

### 새로운 시설 유형 추가

1. **domain-config.ts에 새 도메인 추가**:
```typescript
airport: {
  displayName: '공항',
  endpoint: 'airports',
  components: ['facility', 'floors', 'airportInfo'] as const
}
```

2. **필요한 DataComponent 타입 정의**:
```typescript
airportInfo: {
  createRequest: { terminalCount?: number; runwayCount?: number; };
  updateRequest: { terminalCount: number; runwayCount: number; };
  response: { airportInfo: { terminalCount: number; runwayCount: number; } };
};
```

3. **새 폼 컴포넌트 생성**:
```typescript
// AirportInfoFormComponent.tsx
import { FacilityFormComponentProps } from '../../types';

export const AirportInfoFormComponent: React.FC<FacilityFormComponentProps> = ({ register, errors }) => {
  // 공항 정보 입력 폼 구현
};
```

4. **모달에서 새 컴포넌트 렌더링 로직 추가**:
```typescript
case 'airportInfo':
  return (
    <AirportInfoFormComponent
      register={register}
      errors={errors}
    />
  );
```

### 커스텀 유효성 검사 추가

```typescript
// facility/types/form.ts에서
const createFacilitySchema = z.object({
  // 기존 스키마...
  customField: z.string()
    .min(3, '최소 3자 이상 입력해주세요')
    .max(50, '최대 50자까지 입력 가능합니다')
    .regex(/^[a-zA-Z0-9]+$/, '영문자와 숫자만 입력 가능합니다'),
});
```

## 주의사항

1. **타입 안전성**: 새로운 컴포넌트 추가 시 `facility/types/form.ts`의 타입 정의도 함께 업데이트해야 합니다.
2. **에러 처리**: 현재는 콘솔 로그로만 에러를 처리하고 있으니, 실제 프로덕션에서는 적절한 토스트나 알림 시스템을 구현해야 합니다.
3. **데이터 새로고침**: 시설 생성 후 목록 데이터 새로고침 로직을 구현해야 합니다.

## 개발 팁

- 각 폼 컴포넌트는 독립적으로 개발/테스트 가능합니다.
- domain-config를 수정하면 자동으로 해당 변경사항이 모달에 반영됩니다.
- useFieldArray를 사용하는 동적 입력 필드들은 성능을 위해 적절한 key를 사용하고 있습니다.
