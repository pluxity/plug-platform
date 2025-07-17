# @plug/api-hooks

React 애플리케이션에서 API 통신을 위한 훅 라이브러리입니다. SWR과 Ky 라이브러리를 기반으로 타입 안전한 HTTP 클라이언트와 React 훅을 제공합니다.

## 📁 패키지 구조

```
src/
├── constants/          # HTTP 상태 코드와 성공 코드 상수
├── core/              # 기본 HTTP 클라이언트 (Ky 기반)
├── hooks/             # React 훅들
├── types/             # TypeScript 타입 정의
├── util/              # 유틸리티 함수들
└── index.ts           # 메인 export 파일
```

## 🚀 주요 기능

### 1. HTTP 클라이언트 (`api`)
- **Ky 기반**: 현대적이고 가벼운 HTTP 클라이언트
- **자동 에러 처리**: 응답 에러를 자동으로 캐치하고 처리
- **타입 안전성**: TypeScript로 완전히 작성된 타입 안전한 API
- **인증 지원**: `requireAuth` 옵션으로 인증이 필요한 요청 처리
- **FormData 지원**: 파일 업로드를 위한 FormData 자동 처리

### 2. React 훅들

#### `useApi<T>`
기본적인 API 호출을 위한 훅입니다.

```typescript
const { data, error, isLoading, execute } = useApi<UserData>();

// GET 요청
await execute('/users', 'GET');

// POST 요청 (데이터 포함)
await execute('/users', 'POST', { name: 'John', email: 'john@example.com' });

// PUT/PATCH/DELETE 요청
await execute('/users/1', 'PUT', { name: 'Jane' });
await execute('/users/1', 'DELETE');
```

#### `useSWRApi<T>`
SWR을 활용한 데이터 페칭 훅입니다. 캐싱, 재검증, 백그라운드 업데이트 등의 기능을 제공합니다.

```typescript
const { data, error, isLoading, mutate, refresh } = useSWRApi<UserData[]>('/users');

// 데이터 새로고침
refresh();

// 수동으로 데이터 변경
mutate(newUserData);
```

### 3. 타입 시스템

#### 응답 타입
```typescript
interface DataResponseBody<T> {
  data: T;
  message: string;
  timestamp: string;
}

interface ErrorResponseBody {
  status: number;
  message: string;
  code: string;
  timestamp: string;
  error: string;
}
```

#### 요청 옵션
```typescript
interface RequestOptions {
  requireAuth?: boolean;  // 인증 필요 여부 (기본값: true)
  onSuccess?: (data: any) => void;  // 성공 콜백
  onError?: (error: ErrorResponseBody) => void;  // 에러 콜백
}
```

### 4. 상수 정의

#### HTTP 상태 코드
```typescript
enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  // ... 기타 상태 코드
}
```

## 📦 설치 및 설정

### 의존성
- **SWR**: 데이터 페칭과 캐싱
- **Ky**: 현대적인 HTTP 클라이언트
- **React**: React 훅 사용을 위해 필요

### Peer Dependencies
- `react ^19.0.0`
- `react-dom ^19.0.0`

## 💡 사용 예시

### 기본 사용법

```typescript
import { useApi, useSWRApi, api } from '@plug/api-hooks';

// 컴포넌트에서 사용
function UserProfile({ userId }: { userId: string }) {
  // SWR을 사용한 데이터 페칭 (자동 캐싱, 재검증)
  const { data: user, error, isLoading } = useSWRApi<User>(`/users/${userId}`);
  
  // 수동 API 호출을 위한 훅
  const { execute: updateUser, isLoading: isUpdating } = useApi<User>();
  
  const handleUpdate = async (userData: Partial<User>) => {
    try {
      await updateUser(`/users/${userId}`, 'PUT', userData);
      // 성공적으로 업데이트됨
    } catch (error) {
      // 에러 처리
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={() => handleUpdate({ name: 'New Name' })}>
        {isUpdating ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}
```

### 직접 API 클라이언트 사용

```typescript
import { api } from '@plug/api-hooks';

// GET 요청
const response = await api.get<User[]>('/users');
console.log(response.data);

// POST 요청 (JSON)
await api.post('/users', { name: 'John', email: 'john@example.com' });

// POST 요청 (FormData - 파일 업로드)
const formData = new FormData();
formData.append('file', file);
await api.post('/upload', formData);

// PUT/PATCH/DELETE 요청
await api.put('/users/1', { name: 'Jane' });
await api.delete('/users/1');
```

### 에러 처리

```typescript
import { createErrorFromResponse } from '@plug/api-hooks';

try {
  const data = await api.get('/users');
} catch (error) {
  const processedError = createErrorFromResponse(error);
  console.error('API Error:', processedError.message);
  console.error('Status:', processedError.status);
  console.error('Code:', processedError.code);
}
```

## 🔧 고급 설정

### 커스텀 요청 옵션

```typescript
const { data } = useSWRApi<User>('/users/1', 'GET', undefined, {
  requireAuth: false,  // 인증 불필요
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error)
});
```

### SWR 설정

```typescript
const { data } = useSWRApi<User[]>('/users', 'GET', undefined, undefined, {
  refreshInterval: 5000,  // 5초마다 자동 새로고침
  revalidateOnFocus: false,  // 포커스 시 재검증 비활성화
  dedupingInterval: 2000  // 중복 요청 방지 시간
});
```

## 🏗️ 아키텍처

### 기본 구조
1. **Core Layer**: Ky 기반의 HTTP 클라이언트
2. **Hook Layer**: React 훅들 (useApi, useSWRApi)
3. **Type Layer**: TypeScript 타입 정의
4. **Util Layer**: 에러 처리 및 유틸리티 함수

### 에러 처리 플로우
1. HTTP 에러 발생 → Ky afterResponse 훅에서 캐치
2. `createErrorFromResponse`로 에러 객체 정규화
3. 사용자 정의 `onError` 콜백 실행 (있는 경우)
4. React 컴포넌트에서 에러 상태로 전달

## 📝 라이선스

이 패키지는 프라이빗 패키지입니다.

## 🤝 기여하기

이 패키지는 PLUXITY 플랫폼의 일부입니다. 기여나 문의사항이 있으시면 팀에 연락해주세요.