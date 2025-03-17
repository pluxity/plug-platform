# 빌드 스테이지
FROM node:22-alpine AS builder

# 기본 패키지 및 pnpm 설정
RUN apk add --no-cache libc6-compat openssl \
    && corepack enable

# pnpm 설정
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 매니저 파일 복사 및 의존성 설치 준비
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# 모노레포 packages 복사
COPY packages ./packages

# 앱 package.json 복사
COPY apps/tancheon-odor-monitoring/package.json ./apps/tancheon-odor-monitoring/

# 의존성 설치 (앱 관련 의존성만)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @plug/tancheon...

# 앱 관련 파일 복사
COPY apps/tancheon-odor-monitoring ./apps/tancheon-odor-monitoring

# 앱 디렉토리로 이동
WORKDIR /app/apps/tancheon-odor-monitoring

# Prisma 클라이언트 생성 및 빌드
RUN pnpm dlx prisma generate --schema=./prisma/schema.prisma \
    && pnpm run copy-cesium \
    && pnpm exec next build

# 실행 스테이지
FROM node:22-alpine AS runner

# 기본 패키지 설치
RUN apk add --no-cache libc6-compat openssl

# pnpm 설정
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# pluxity 사용자 설정
RUN addgroup --system --gid 1001 pluxity \
    && adduser --system --uid 1001 pluxity --ingroup pluxity \
    && mkdir -p /pnpm \
    && chown -R pluxity:pluxity /pnpm

# 작업 디렉토리 설정
WORKDIR /app

# 루트 package.json 및 pnpm 파일 복사
COPY --from=builder --chown=pluxity:pluxity /app/package.json ./
COPY --from=builder --chown=pluxity:pluxity /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=pluxity:pluxity /app/pnpm-lock.yaml ./

# 공유 패키지 복사
COPY --from=builder --chown=pluxity:pluxity /app/packages ./packages

# 앱 파일 복사
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/package.json ./apps/tancheon-odor-monitoring/
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/.next ./apps/tancheon-odor-monitoring/.next
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/public ./apps/tancheon-odor-monitoring/public
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/next.config.ts ./apps/tancheon-odor-monitoring/
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/prisma ./apps/tancheon-odor-monitoring/prisma
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/scripts ./apps/tancheon-odor-monitoring/scripts
# COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/.env ./apps/tancheon-odor-monitoring/
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/.env.production ./apps/tancheon-odor-monitoring/.env
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/.env.production ./apps/tancheon-odor-monitoring/

# node_modules 복사 (프로덕션 의존성만)
COPY --from=builder --chown=pluxity:pluxity /app/node_modules ./node_modules
COPY --from=builder --chown=pluxity:pluxity /app/apps/tancheon-odor-monitoring/node_modules ./apps/tancheon-odor-monitoring/node_modules

# 앱 디렉토리로 이동
WORKDIR /app/apps/tancheon-odor-monitoring

# 스크립트 실행 권한 설정
USER root
RUN chmod +x ./scripts/start.sh && chown -R pluxity:pluxity /app
USER pluxity

# 포트 설정
EXPOSE 3000

# 건강 체크
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:3000/api/health || exit 1

# 시작 스크립트 실행
CMD ["sh", "./scripts/start.sh"]