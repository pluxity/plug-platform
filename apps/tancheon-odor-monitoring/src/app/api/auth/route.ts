// apps/tancheon-odor-monitoring/src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', ''); // 헤더에서 토큰 추출

  if (!token) {
    return NextResponse.json({ message: '토큰이 없습니다.' }, { status: 401 });
  }

  try {
    if(!process.env.JWT_SECRET){
      console.error("JWT_SECRET is not defined");
      return NextResponse.json({ message: 'JWT_SECRET이 없습니다.' }, { status: 500 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ message: '토큰 검증 성공', user: decoded });
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    return NextResponse.json({ message: '토큰 검증 실패' }, { status: 401 });
  }
}
