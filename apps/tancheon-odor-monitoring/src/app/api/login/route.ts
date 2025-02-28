// apps/tancheon-odor-monitoring/src/app/api/login/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_name, password } = body;

    console.log('Received login attempt for user:', user_name); // 로그 추가

    // 1. 사용자 조회
    const user = await prisma.users.findUnique({
      where: { user_name },
    });

    if (!user) {
      console.error('User not found:', user_name); // 로그 추가
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 2. 비밀번호 검증 (bcrypt.compare 사용)
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.error('Password mismatch for user:', user_name); // 로그 추가
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 3. JWT 토큰 생성 (ROLE 정보 포함)
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // ROLE 정보를 토큰에 포함
      process.env.JWT_SECRET!, // 사용되는 JWT_SECRET 값을 확인하기 위해! 추가
      {
        expiresIn: '1h',
      }
    );

    console.log('JWT_SECRET used for token generation:', process.env.JWT_SECRET); // 로그 추가

    return NextResponse.json({ token, user }, { status: 200 }); //사용자 정보도 반환
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
