# Plug Platform

> Cesium 기반 3D 지도 플랫폼을 위한 모노레포 프로젝트

## 📖 개요

Plug Platform은 Cesium 3D 지도 엔진을 기반으로 한 웹 기반 지도 플랫폼입니다. 모노레포 구조로 여러 애플리케이션과 공유 패키지를 하나의 저장소에서 효율적으로 관리합니다.

## 🏗️ 프로젝트 구조

```
plug-platform/
├── apps/                    # 애플리케이션들
│   ├── core/               # 메인 웹 애플리케이션
│   ├── sample/             # 샘플 앱
│   └── test/               # 테스트 앱
│
├── packages/               # 공유 패키지들
│   ├── engine/            # 3D 엔진 (Three.js 기반)
│   ├── api-hooks/         # API 통신 훅 라이브러리
│   ├── ui/                # UI 컴포넌트 라이브러리
│   └── common-services/   # 공통 서비스
│
└── package.json           # 루트 package.json
```

## 📋 필수 요구사항

- **Node.js** 18 이상
- **pnpm** 8 이상

## 🚀 빠른 시작

```bash
# 의존성 설치
pnpm install

# Core 앱 개발 서버 시작
pnpm core dev

# 빌드
pnpm core build
```

## 📦 애플리케이션

### [Core App](./apps/core/README.md)
메인 웹 애플리케이션 - Cesium 기반 3D 지도 플랫폼

**주요 기능:**
- Cesium 기반 3D 지도 렌더링
- WebRTC 실시간 통신
- POI(관심 지점) 관리
- 백오피스 관리 시스템

**실행 명령어:**
```bash
pnpm core dev      # 개발 서버 시작
pnpm core build    # 프로덕션 빌드
```

**자세한 내용:** [apps/core/README.md](./apps/core/README.md)

## 🧩 공유 패키지

### [@plug/engine](./packages/engine/readme.md)
Three.js 기반 3D 렌더링 엔진

**주요 기능:**
- 3D 모델 로딩 및 렌더링
- 카메라 제어
- POI 관리
- 이벤트 시스템
- 효과 및 라벨 시스템

**자세한 내용:** [packages/engine/readme.md](./packages/engine/readme.md)

### [@plug/api-hooks](./packages/api-hooks/README.md)
React 애플리케이션을 위한 API 통신 훅 라이브러리

**주요 기능:**
- SWR 기반 데이터 페칭
- 타입 안전한 HTTP 클라이언트 (Ky)
- 범용 API 훅 (`useApi`)
- HTTP 메서드별 전용 훅 (useGet, usePost, usePut, usePatch, useDelete)

**자세한 내용:** [packages/api-hooks/README.md](./packages/api-hooks/README.md)

### @plug/ui
UI 컴포넌트 라이브러리

**주요 기능:**
- 재사용 가능한 React 컴포넌트
- Tailwind CSS 스타일링
- 폼 컴포넌트 및 검증

### @plug/common-services
공통 서비스 및 유틸리티

**주요 기능:**
- 인증 서비스
- 공통 비즈니스 로직
- 유틸리티 함수

## 🛠️ 개발 가이드

### 모노레포 명령어

모든 명령어는 **프로젝트 루트 디렉토리**에서 실행합니다.

```bash
# 특정 앱 실행
pnpm core dev              # Core 앱
pnpm sample dev            # Sample 앱

# 특정 패키지 작업
pnpm ui dev                # UI 패키지 개발
pnpm api-hooks build       # API Hooks 빌드

# 전체 프로젝트
pnpm install               # 모든 의존성 설치
pnpm -r build              # 모든 패키지 빌드
pnpm -r update             # 모든 의존성 업데이트

# 코드 포맷팅
pnpm format <files>        # Prettier 포맷팅
```

### 새 패키지 추가하기

1. `packages/` 또는 `apps/` 디렉토리에 새 폴더 생성
2. `package.json` 작성 (name은 `@plug/package-name` 형식)
3. 루트에서 `pnpm install` 실행

### 패키지 간 의존성

다른 워크스페이스 패키지를 사용하려면:

```json
{
  "dependencies": {
    "@plug/ui": "workspace:*",
    "@plug/api-hooks": "workspace:*"
  }
}
```

## 🔧 기술 스택

- **Frontend:** React 19, TypeScript, Vite
- **3D Graphics:** Cesium, Three.js
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** SWR, Ky
- **Forms:** React Hook Form, Zod
- **Monorepo:** pnpm workspaces

## 📝 컨벤션

### 커밋 메시지

```
<type>(<scope>) : <subject>

예시:
feat(core) : POI 필터링 기능 추가
fix(api-hooks) : useApi 타입 오류 수정
chore : 의존성 업데이트
```

**Types:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `hotfix`: 긴급 수정
- `refactor`: 리팩토링
- `chore`: 기타 작업 (의존성, 설정 등)
- `docs`: 문서 수정

### 브랜치 전략

- `main`: 프로덕션 브랜치
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정
- `hotfix/*`: 긴급 수정

## 🤝 기여하기

1. 기능 브랜치 생성
2. 변경 사항 작성
3. 린트 및 타입 체크 (`pnpm core lint`)
4. 커밋 및 푸시
5. Pull Request 생성

## 📄 라이센스

ISC License
