export const dynamic = "force-dynamic";
// ...existing code...
import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const CAR_CONFIGS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CAR_CONFIGS_COLLECTION_ID;

if (!DATABASE_ID || !CAR_CONFIGS_COLLECTION_ID) {
  throw new Error('Please define the Appwrite database and collection IDs in .env');
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const modelId = searchParams.get('modelId');

    if (!modelId) {
      return NextResponse.json(
        { success: false, error: 'Model ID is required' },
        { status: 400 }
      );
    }

    // Query the configurations collection for the given model
    const response = await databases.listDocuments(
      DATABASE_ID as string,
      CAR_CONFIGS_COLLECTION_ID as string,
      [
        Query.equal('modelId', modelId),
        Query.orderDesc('$createdAt'),
        Query.limit(1)
      ]
    );

    // Get the most recent configuration
    const config = response.documents[0];

    return NextResponse.json({ 
      success: true, 
      config: config || null
    });
  } catch (error) {
    console.error('Error fetching configuration:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch configuration' 
      },
      { status: 500 }
    );
  }
} 