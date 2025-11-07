# Plug Platform Core

> Cesium 기반 3D 지도 플랫폼 - React 19, TypeScript, Vite로 구축된 WebRTC 통합 플랫폼

## 📋 필수 요구사항

- **Node.js** 18 이상
- **pnpm** 8 이상

## 🚀 빠른 시작 (처음 사용하는 경우)

### 1. 의존성 설치

프로젝트는 **모노레포** 구조입니다. 루트 디렉토리에서 한 번만 설치하면 모든 패키지가 설치됩니다.

```bash
# 프로젝트 루트 디렉토리로 이동
cd plug-platform

# 모든 의존성 설치 (처음 한 번만)
pnpm install
```

### 2. 환경 변수 설정

apps/core 디렉토리에 환경 파일을 생성합니다.

```bash
# apps/core 디렉토리로 이동
cd apps/core

# .env.development 파일 생성 (개발 환경)
# 아래 내용을 복사해서 파일을 만들어주세요
```

**.env.development 예시:**
```env
# Cesium Configuration
VITE_CESIUM_ION_ACCESS_TOKEN=your_token_here
VITE_CESIUM_ION_ASSET_ID=96188

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_key_here

# WebRTC Configuration
VITE_WEBRTC_HOST=192.168.10.181
VITE_WEBRTC_PORT=8889

# Backend API
VITE_API_BASE_URL=http://localhost:4000/api
```

### 3. 개발 서버 실행

**반드시 프로젝트 루트 디렉토리**에서 실행해야 합니다.

```bash
# 프로젝트 루트로 이동
cd plug-platform

# Core 앱 개발 서버 시작
pnpm core dev
```

서버가 시작되면 브라우저에서 **http://localhost:4000** 으로 접속합니다.

## 📖 모노레포 구조 이해하기

이 프로젝트는 여러 패키지가 하나의 저장소에서 관리되는 **모노레포** 구조입니다.

```
plug-platform/                 # 루트 디렉토리 (여기서 명령어 실행!)
├── apps/
│   └── core/                 # 이 앱 (메인 웹 애플리케이션)
├── packages/                 # 공유 패키지들
│   ├── ui/                   # UI 컴포넌트 라이브러리
│   ├── api-hooks/            # API 통신 훅
│   ├── common-services/      # 공통 서비스
│   └── engine/               # 엔진 기능
└── package.json              # 루트 package.json
```

### 중요: 명령어는 루트에서 실행

```bash
# ✅ 올바른 방법 (루트에서)
pnpm core dev

# ❌ 잘못된 방법 (apps/core에서)
cd apps/core
pnpm dev  # 이렇게 하면 안됩니다!
```

## 🛠️ 자주 사용하는 명령어

모든 명령어는 **프로젝트 루트 디렉토리**에서 실행합니다.

```bash
# 개발 서버 시작
pnpm core dev

# 프로덕션 빌드
pnpm core build

# 빌드 결과 미리보기
pnpm core preview

# 린트 검사
pnpm core lint

# 린트 자동 수정
pnpm core lint:fix

# 타입 체크
pnpm core type-check
```

## 📁 Core 앱 구조

```
apps/core/
├── src/
│   ├── app/                  # 메인 앱 기능
│   │   ├── view/            # UI 컴포넌트
│   │   │   ├── components/  # 재사용 컴포넌트
│   │   │   ├── hooks/       # 커스텀 훅
│   │   │   └── layouts/     # 레이아웃
│   │   └── pages/           # 페이지 컴포넌트
│   ├── backoffice/          # 백오피스 기능
│   ├── global/              # 전역 설정
│   │   ├── router/          # 라우터 설정
│   │   └── stores/          # 상태 관리
│   └── main.tsx             # 앱 진입점
├── public/                   # 정적 파일
│   ├── images/
│   └── logo.svg
├── .env.development          # 개발 환경 변수
├── .env.staging              # 스테이징 환경 변수
└── vite.config.ts            # Vite 설정
```

## 🔧 주요 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Cesium** - 3D 지도
- **React Router** - 라우팅
- **Zustand** - 상태 관리
- **React Hook Form** - 폼 관리

## 🌍 환경별 설정

### 개발 환경 (Development)
- 포트: 4000
- 환경 파일: `.env.development`
- API Proxy: vite.config.ts에서 설정

### 스테이징 환경 (Staging)
- 환경 파일: `.env.staging`
- Context Path: `/gs_auth`

### 프로덕션 환경 (Production)
- 환경 파일: `.env.production`
- Base Path: `./` (상대 경로)

## ❓ 문제 해결

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### "Cannot find module '@plug/ui'"
```bash
# 루트에서 재설치
pnpm install
```

### 포트가 이미 사용 중
```bash
# vite.config.ts에서 포트 변경
server: {
  port: 4000  # 다른 포트로 변경
}
```

### WebRTC 연결 실패
- `.env.development`의 `VITE_WEBRTC_HOST` 주소 확인
- WebRTC 서버가 실행 중인지 확인

## 📦 공유 패키지 사용하기

Core 앱은 다음 패키지들을 자동으로 사용합니다:

```typescript
// UI 컴포넌트 사용
import { Button } from '@plug/ui'

// API 훅 사용
import { useDevices } from '@plug/api-hooks'

// 공통 서비스 사용
import { authService } from '@plug/common-services'
```

## 🤝 기여하기

1. 기능 브랜치 생성
2. 변경 사항 작성
3. `pnpm core lint` 실행
4. 커밋 및 푸시
5. Pull Request 생성

## 📝 라이센스

ISC License
