import { storage, BUCKET_ID } from "../lib/appwrite"
import { ID } from "appwrite"
import * as fs from "fs"
import * as path from "path"

const IMAGES_DIR = path.join(process.cwd(), "public", "assets", "image")

async function uploadImages() {
  try {
    const files = fs.readdirSync(IMAGES_DIR)
    
    for (const file of files) {
      if (file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png")) {
        const filePath = path.join(IMAGES_DIR, file)
        const fileBuffer = fs.readFileSync(filePath)
        const fileBlob = new Blob([fileBuffer])
        
        console.log(`Uploading ${file}...`)
        
        await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          fileBlob
        )
        
        console.log(`Successfully uploaded ${file}`)
      }
    }
    
    console.log("All images uploaded successfully!")
  } catch (error) {
    console.error("Error uploading images:", error)
  }
}

uploadImages() 