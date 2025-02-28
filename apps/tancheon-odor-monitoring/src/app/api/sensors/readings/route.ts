import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 특정 센서의 측정값 조회
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sensorId = searchParams.get('sensorId');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    if (!sensorId) {
      return NextResponse.json({ message: '센서 ID가 필요합니다.' }, { status: 400 });
    }

    const readings = await prisma.readings.findMany({
      where: {
        sensorId: parseInt(sensorId),
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });

    return NextResponse.json(readings, { status: 200 });
  } catch (error) {
    console.error('측정값 조회 오류:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 새 측정값 등록
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sensorId, value, unit } = body;

    // 입력값 검증
    if (!sensorId || value === undefined || !unit) {
      return NextResponse.json(
        { message: '센서 ID, 측정값, 단위는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    // 센서 존재 여부 확인
    const sensor = await prisma.sensors.findUnique({
      where: { id: sensorId },
    });

    if (!sensor) {
      return NextResponse.json({ message: '존재하지 않는 센서입니다.' }, { status: 404 });
    }

    // 측정값 생성
    const newReading = await prisma.readings.create({
      data: {
        sensorId,
        value,
        unit,
      },
    });

    return NextResponse.json(newReading, { status: 201 });
  } catch (error) {
    console.error('측정값 등록 오류:', error);
    return NextResponse.json({ message: '측정값 등록 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 