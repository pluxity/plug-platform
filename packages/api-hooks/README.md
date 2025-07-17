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
- **useApi**: 범용적인 API 호출 훅 - 다양한 API 클라이언트와 비동기 함수 지원
- **HTTP 메서드별 전용 훅**: useGet, usePost, usePut, usePatch, useDelete
- **useSWRApi**: SWR 기반의 데이터 페칭 훅 (캐싱, 재검증)

### 3. 범용성과 확장성
- **다양한 API 연동**: REST, GraphQL, 외부 서비스 등 어떤 Promise 기반 함수든 지원
- **일관된 인터페이스**: 모든 API 호출이 동일한 상태 관리 패턴 (`data`, `error`, `isLoading`, `execute`)
- **타입 안전성**: 제네릭을 통한 완전한 타입 추론 지원

#### `useApi<T, P>`
범용적인 API 호출을 위한 훅입니다. 다양한 API 클라이언트와 비동기 함수를 지원합니다.

```typescript
const { data, error, isLoading, execute, reset, response } = useApi<T, P>(
  apiMethod: (...args: P) => Promise<unknown>,
  method: HttpMethod
);
```

**제네릭 타입:**
- `T`: API 응답 데이터의 타입
- `P`: API 메서드에 전달될 매개변수들의 타입 배열

**기본 사용법:**
```typescript
// 매개변수가 없는 GET 요청
const getUserList = useApi<User[], []>(
  () => api.get('/users'),
  'GET'
);

// 매개변수가 있는 POST 요청
const createUser = useApi<User, [UserCreateData]>(
  (userData) => api.post('/users', userData),
  'POST'
);

// 사용
await getUserList.execute();
await createUser.execute({ name: 'John', email: 'john@example.com' });
```

**다양한 API 클라이언트 지원:**
```typescript
// 기본 fetch API 사용
const fetchApi = useApi<ApiResponse, [string]>(
  async (url) => {
    const response = await fetch(url);
    return response.json();
  },
  'GET'
);

// axios 사용
const axiosApi = useApi<UserData, [string]>(
  async (userId) => {
    const response = await axios.get(`/users/${userId}`);
    return response.data;
  },
  'GET'
);

// 외부 API 서비스
const externalApi = useApi<PaymentResult, [PaymentData]>(
  (paymentData) => externalPaymentService.processPayment(paymentData),
  'POST'
);

// GraphQL 클라이언트
const graphqlApi = useApi<GraphQLResponse, [string, object]>(
  (query, variables) => graphqlClient.request(query, variables),
  'POST'
);
```

#### HTTP 메서드별 전용 훅들
각 HTTP 메서드에 특화된 편의 훅들도 제공됩니다:

```typescript
// GET 요청 전용
const { data, error, isLoading } = useGet<User[]>('/users');

// POST 요청 전용  
const { execute: createUser } = usePost<UserCreateData>('/users');
await createUser.execute(userData);

// PUT 요청 전용
const { execute: updateUser } = usePut<UserUpdateData>('/users/1');
await updateUser.execute(updateData);

// PATCH 요청 전용
const { execute: patchUser } = usePatch<Partial<User>>('/users/1');
await patchUser.execute({ name: 'New Name' });

// DELETE 요청 전용
const { execute: deleteUser } = useDelete('/users/1');
await deleteUser.execute();
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
import { useApi, useGet, usePost, useSWRApi, api } from '@plug/api-hooks';

// 컴포넌트에서 사용
function UserProfile({ userId }: { userId: string }) {
  // SWR을 사용한 데이터 페칭 (자동 캐싱, 재검증)
  const { data: user, error, isLoading } = useSWRApi<User>(`/users/${userId}`);
  
  // HTTP 메서드별 전용 훅 사용
  const updateUser = usePut<UserUpdateData>(`/users/${userId}`);
  const deleteUser = useDelete(`/users/${userId}`);
  
  const handleUpdate = async (userData: UserUpdateData) => {
    try {
      await updateUser.execute(userData);
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
        {updateUser.isLoading ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}
```

### 다양한 API 연동

```typescript
// 여러 다른 API 서비스를 동일한 인터페이스로 사용
function MultiApiComponent() {
  // 기본 REST API
  const userApi = useGet<User[]>('/api/users');
  
  // 외부 결제 API
  const paymentApi = useApi<PaymentResult, [PaymentData]>(
    (data) => paymentService.processPayment(data),
    'POST'
  );
  
  // GraphQL API
  const graphqlApi = useApi<GraphQLResponse, [string]>(
    (query) => graphqlClient.request(query),
    'POST'
  );
  
  // 파일 업로드 API
  const uploadApi = useApi<UploadResult, [File]>(
    async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post('/upload', formData);
    },
    'POST'
  );
  
  // 모든 API가 동일한 인터페이스: { data, error, isLoading, execute }
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

### 커스텀 API 함수와 useApi 조합

```typescript
// 커스텀 API 함수들
const customApiMethods = {
  // 복잡한 검색 API
  searchUsers: async (filters: UserFilters) => {
    return await api.post('/users/search', filters);
  },
  
  // 배치 처리 API
  batchUpdateUsers: async (updates: UserUpdate[]) => {
    return await api.patch('/users/batch', { updates });
  },
  
  // 외부 서비스 호출
  validateEmail: async (email: string) => {
    return await externalValidator.checkEmail(email);
  }
};

// useApi로 래핑하여 상태 관리 추가
function useCustomApis() {
  const searchUsers = useApi<User[], [UserFilters]>(
    customApiMethods.searchUsers,
    'POST'
  );
  
  const batchUpdate = useApi<BatchResult, [UserUpdate[]]>(
    customApiMethods.batchUpdateUsers,
    'PATCH'
  );
  
  const validateEmail = useApi<ValidationResult, [string]>(
    customApiMethods.validateEmail,
    'GET'
  );
  
  return { searchUsers, batchUpdate, validateEmail };
}

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