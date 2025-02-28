// apps/tancheon-odor-monitoring/src/app/api/signup/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_name, password } = body;

    // 1. 입력값 검증
    if (!user_name || !password) {
      return NextResponse.json(
        { message: '아이디와 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 2. 기존 사용자 존재 여부 확인
    const existingUser = await prisma.users.findUnique({
      where: { user_name },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: '이미 존재하는 아이디입니다.' },
        { status: 409 }
      );
    }

    // 3. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10); // 비용 계수(rounds)는 10으로 설정 (조정 가능)

    // 4. 사용자 생성 (해싱된 비밀번호 저장)
    const newUser = await prisma.users.create({
      data: {
        user_name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: '회원가입 성공', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

