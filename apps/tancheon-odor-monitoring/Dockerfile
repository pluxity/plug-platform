# 빌드 스테이지
FROM node:22-alpine AS builder

# 루트 디렉토리로 이동
WORKDIR /app

# corepack 활성화
RUN corepack enable

# pnpm-workspace.yaml 복사
COPY pnpm-workspace.yaml ./

# 루트 디렉토리의 pnpm-lock.yaml 파일 복사
COPY pnpm-lock.yaml ./

# 루트 디렉토리의 package.json 파일 복사
COPY package.json ./

# pnpm install (루트 디렉토리의 의존성 설치)
RUN pnpm install

# packages 디렉토리 복사
COPY packages ./packages

# 앱 디렉토리 복사
COPY apps/tancheon-odor-monitoring ./apps/tancheon-odor-monitoring

# 앱 디렉토리로 이동
WORKDIR /app/apps/tancheon-odor-monitoring

# 앱 디렉토리의 package.json 복사
COPY apps/tancheon-odor-monitoring/package.json ./

# 앱 디렉토리의 pnpm install (모든 의존성 설치)
RUN pnpm install

# 나머지 소스 코드 복사
COPY apps/tancheon-odor-monitoring/ .

# Next.js 빌드
RUN pnpm run build
