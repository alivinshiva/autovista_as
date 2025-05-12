import { NextResponse } from 'next/server'
import { getAllCarModels } from '@/lib/appwrite'

export async function GET() {
  try {
    const models = await getAllCarModels()
    return NextResponse.json({ success: true, models })
  } catch (error) {
    console.error('Error fetching car models:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch car models' },
      { status: 500 }
    )
  }
} 