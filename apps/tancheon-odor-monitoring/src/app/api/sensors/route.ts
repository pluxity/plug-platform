import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 모든 센서 조회
export async function GET() {
  try {
    const sensors = await prisma.sensors.findMany({
      include: {
        readings: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1, // 가장 최근 측정값만 가져옴
        },
      },
    });
    return NextResponse.json(sensors, { status: 200 });
  } catch (error) {
    console.error('센서 목록 조회 오류:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 새 센서 등록
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location, description, status = 'ACTIVE' } = body;

    // 입력값 검증
    if (!name || !location) {
      return NextResponse.json(
        { message: '센서 이름과 위치는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    // 센서 생성
    const newSensor = await prisma.sensors.create({
      data: {
        name,
        location,
        description,
        status,
      },
    });

    return NextResponse.json(newSensor, { status: 201 });
  } catch (error) {
    console.error('센서 등록 오류:', error);
    return NextResponse.json({ message: '센서 등록 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 센서 정보 수정
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, location, description, status } = body;

    if (!id) {
      return NextResponse.json({ message: '센서 ID가 필요합니다.' }, { status: 400 });
    }

    // 수정할 데이터 준비
    const updateData: any = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;

    // 센서 업데이트
    const updatedSensor = await prisma.sensors.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedSensor, { status: 200 });
  } catch (error) {
    console.error('센서 수정 오류:', error);
    return NextResponse.json({ message: '센서 수정 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 센서 삭제
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: '센서 ID가 필요합니다.' }, { status: 400 });
    }

    // 관련 측정값 먼저 삭제
    await prisma.readings.deleteMany({
      where: { sensorId: id },
    });

    // 센서 삭제
    await prisma.sensors.delete({
      where: { id },
    });

    return NextResponse.json({ message: '센서가 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('센서 삭제 오류:', error);
    return NextResponse.json({ message: '센서 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 