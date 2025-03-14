# 빌드 스테이지
FROM node:22-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 성능 최적화 및 패키지 매니저 설정
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Prisma에 필요한 패키지 설치
RUN apk add --no-cache openssl

# 루트 패키지 의존성 파일 복사
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# 필요한 packages 폴더 복사 (공유 라이브러리가 있는 경우)
COPY packages ./packages

# 앱 디렉토리 의존성 파일과 스크립트 복사
COPY apps/tancheon-odor-monitoring/package.json ./apps/tancheon-odor-monitoring/
COPY apps/tancheon-odor-monitoring/next.config.ts ./apps/tancheon-odor-monitoring/
COPY apps/tancheon-odor-monitoring/tsconfig.json ./apps/tancheon-odor-monitoring/
COPY apps/tancheon-odor-monitoring/scripts ./apps/tancheon-odor-monitoring/scripts
COPY apps/tancheon-odor-monitoring/prisma ./apps/tancheon-odor-monitoring/prisma

# 모든 의존성 설치 (프로덕션 모드로)
RUN pnpm install --frozen-lockfile

# 앱 소스코드 복사
COPY apps/tancheon-odor-monitoring ./apps/tancheon-odor-monitoring

# 앱 디렉토리로 이동
WORKDIR /app/apps/tancheon-odor-monitoring

# 환경 변수 파일 설정 (필요한 경우)
COPY apps/tancheon-odor-monitoring/.env.production ./.env.production

# 임시 데이터베이스 URL 설정 - Prisma에서 generate 명령에 필요
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tancheon?schema=public"

# Prisma 클라이언트 생성 - 수정된 명령어 및 디버깅 정보 추가
RUN pnpm dlx prisma generate --schema=./prisma/schema.prisma
RUN ls -la node_modules/.prisma || echo "디렉토리가 없음: node_modules/.prisma"
RUN ls -la node_modules/@prisma || echo "디렉토리가 없음: node_modules/@prisma"

# Cesium 에셋 복사 후 빌드 실행 (package.json의 스크립트 형식에 맞춤)
RUN pnpm run copy-cesium && pnpm exec next build

# 실행 스테이지 - 최소화된 프로덕션 이미지
FROM node:22-alpine AS runner

# 필요한 시스템 패키지 설치 (선택 사항)
RUN apk add --no-cache libc6-compat openssl

# 패키지 매니저로 pnpm 설정
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 앱의 node_modules 복사 (앱 내부 심볼릭 링크)
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/node_modules ./apps/tancheon-odor-monitoring/node_modules
# 루트 node_modules 복사 (실제 의존성이 존재하는 곳)
COPY --from=builder --chown=pluxity:pluxity /app/node_modules ./node_modules

# 앱 디렉토리로 작업 디렉토리 설정 (최적화)
WORKDIR /app/apps/tancheon-odor-monitoring

# pluxity 사용자 생성 (보안 향상)
RUN addgroup --system --gid 1001 pluxity
RUN adduser --system --uid 1001 pluxity --ingroup pluxity

# pnpm 디렉토리에 대한 권한 부여
RUN mkdir -p /pnpm && chown -R pluxity:pluxity /pnpm

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 소스 코드와 빌드 파일 복사
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/package.json ./
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/next.config.ts ./
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/.next ./.next
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/public ./public
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/prisma ./prisma


# PATH에 현재 디렉토리의 node_modules/.bin 추가 (로컬 바이너리 활용)
ENV PATH="/app/apps/tancheon-odor-monitoring/node_modules/.bin:$PATH"

# 바이너리 위치 확인 (디버깅용)
RUN which next || echo "next 명령어를 찾을 수 없음"

# package.json의 start 스크립트 확인 (디버깅용)
RUN cat package.json | grep start || echo "start 스크립트가 없습니다"

# 사용자 변경
USER pluxity

# 노출 포트 설정
EXPOSE 3000

# 건강 체크 설정
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "wget", "-q", "--spider", "http://localhost:3000/api/health" ]

# pnpm start 사용 - package.json의 start 스크립트 실행
CMD ["pnpm", "start"]
