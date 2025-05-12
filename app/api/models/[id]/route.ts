import { NextRequest, NextResponse } from 'next/server'
import { storage, BUCKET_ID } from '@/lib/appwrite'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id
    console.log('Fetching file with ID:', fileId)
    
    // Get the file from Appwrite
    const file = await storage.getFile(BUCKET_ID, fileId)
    console.log('File found:', file)
    
    if (!file) {
      console.log('File not found')
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // Get the file URL
    const fileUrl = storage.getFileView(BUCKET_ID, fileId)
    console.log('File URL:', fileUrl)
    
    // Return the file URL
    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Error fetching model:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    )
  }
} 