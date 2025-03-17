#!/bin/sh
set -e

echo "🔄 데이터베이스 마이그레이션 시작..."

pnpm dlx prisma migrate deploy --schema=./prisma/schema.prisma
echo "✅ 마이그레이션 완료"

echo "🚀 애플리케이션 시작..."
pnpm start 