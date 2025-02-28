import { PrismaClient } from '@prisma/client';

// PrismaClient를 싱글톤으로 사용하기 위한 전역 변수
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 개발 환경에서 핫 리로딩 시 여러 인스턴스가 생성되는 것을 방지
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 