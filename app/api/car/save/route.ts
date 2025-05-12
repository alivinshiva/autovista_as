import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import {CarConfig} from '@/models/CarConfig';
import { useAuth } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
  try {
    const { userId } = useAuth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    await connectToDB();

    const newCar = await CarConfig.create({
      userId,
      carName: body.carName,
      config: body.config,
      isShared: body.isShared || false,
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
