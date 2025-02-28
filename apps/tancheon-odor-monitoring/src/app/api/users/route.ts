// apps/tancheon-odor-monitoring/src/app/api/users/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.users.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_name, password, role } = body;

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10); // 비용 계수(rounds)는 10으로 설정 (조정 가능)

    const newUser = await prisma.users.create({
      data: {
        user_name,
        password: hashedPassword, // 해싱된 비밀번호 저장
        role
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    return NextResponse.json({ message: '사용자 생성 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, user_name, password, role } = body;

    // 비밀번호 해싱 (비밀번호가 변경된 경우만)
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        user_name,
        password: hashedPassword, // 해싱된 비밀번호 저장
        role,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('사용자 수정 오류:', error);
    return NextResponse.json({ message: '사용자 수정 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    await prisma.users.delete({
      where: { id },
    });

    return NextResponse.json({ message: '사용자가 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('사용자 삭제 오류:', error);
    return NextResponse.json({ message: '사용자 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
