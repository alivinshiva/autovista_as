import { Client, Databases, Storage, ID, Query } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Set API key in headers from environment variable
if (process.env.NEXT_PUBLIC_APPWRITE_KEY) {
    client.headers['X-Appwrite-Key'] = process.env.NEXT_PUBLIC_APPWRITE_KEY;
}

// Initialize services
export const databases = new Databases(client);
export const storage = new Storage(client);

// Constants
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

// Function to upload GLB file to Appwrite Storage
export async function uploadGLBFile(fileName: string, fileBuffer: Buffer) {
    try {
        const file = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            new File([fileBuffer], fileName, { type: 'model/gltf-binary' })
        );
        return file.$id;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

// Function to create a car model document
export async function createCarModel(data: {
    modelName: string;
    modelPath: string;
    slug: string;
    imageUrl: string;
    size: number;
    uploadDate: string;
    fileId: string;
}) {
    try {
        const document = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            data
        );
        return document;
    } catch (error) {
        console.error('Error creating car model:', error);
        throw error;
    }
}

// Function to delete a car model
export async function deleteCarModel(documentId: string) {
    try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
    } catch (error) {
        console.error('Error deleting car model:', error);
        throw error;
    }
}

// Function to get all car models
export async function getAllCarModels() {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.orderDesc('uploadDate')]
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching car models:', error);
        throw error;
    }
}

export async function uploadImageToAppwrite(file: File) {
  try {
    const upload = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      file
    );
    return upload.$id;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function getAllImages() {
  try {
    const files = await storage.listFiles(BUCKET_ID);
    return files.files;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
}

export function getImageUrl(fileId: string) {
  return storage.getFileView(BUCKET_ID, fileId).toString();
}

export async function deleteCarModelAndFiles(modelId: string, fileId: string, imageUrl: string) {
  try {
    // Delete from database first
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, modelId);
    
    // Extract file IDs from URLs if they are full URLs
    const modelFileId = fileId.includes('/') ? fileId.split('/').pop() || fileId : fileId;
    const imageFileId = imageUrl.includes('/') ? imageUrl.split('/').pop() || imageUrl : imageUrl;
    
    // Delete files from storage
    try {
      if (modelFileId) {
        await storage.deleteFile(BUCKET_ID, modelFileId);
      }
    } catch (error) {
      console.error("Error deleting model file:", error);
    }

    if (imageFileId) {
      try {
        await storage.deleteFile(BUCKET_ID, imageFileId);
      } catch (error) {
        console.error("Error deleting image file:", error);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting car model:", error);
    throw error;
  }
} 