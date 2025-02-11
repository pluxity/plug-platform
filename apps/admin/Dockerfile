# 1단계: 빌드 단계
FROM node:22-alpine AS builder

WORKDIR /app

# 모노레포 루트에 있는 주요 파일들을 복사합니다.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 전체 소스 파일 복사 (모노레포 전체)
COPY . .

# pnpm 글로벌 설치 (빌드 단계)
RUN npm install -g pnpm

ENV CI=true

# 모든 의존성 설치
RUN pnpm install --frozen-lockfile


# Next.js 애플리케이션(@plug/admin) 빌드 실행
RUN pnpm --filter @plug/admin run build

# 2단계: 런타임(프로덕션) 단계
FROM node:22-alpine AS runner

WORKDIR /app

# 프로덕션 모드 설정
ENV NODE_ENV=production

# 런타임 단계에서도 pnpm이 필요하므로 설치합니다.
RUN npm install -g pnpm

# 빌드 단계에서 생성된 결과물을 복사합니다.
COPY --from=builder /app/ ./

# Next.js 앱이 사용하는 포트 노출 (예: 3000)
EXPOSE 3000

# Next.js 애플리케이션 실행
CMD ["pnpm", "--filter", "@plug/admin", "start"]
