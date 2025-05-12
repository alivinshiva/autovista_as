"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { storage, databases, BUCKET_ID, DATABASE_ID, COLLECTION_ID } from "@/lib/appwrite"
import { ID } from "appwrite"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs"

interface ModelUploadProps {
  onUploadComplete: () => void
}

export default function ModelUpload({ onUploadComplete }: ModelUploadProps) {
  const { userId } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [carName, setCarName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [year, setYear] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.name.toLowerCase().endsWith('.glb')) {
      setFile(selectedFile)
    } else {
      toast.error("Please select a valid GLB file")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0]
    if (selectedImage && selectedImage.type.startsWith('image/')) {
      setImage(selectedImage)
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedImage)
      setImagePreview(previewUrl)
    } else {
      toast.error("Please select a valid image file")
    }
  }

  const handleUpload = async () => {
    if (!file || !carName || !companyName) {
      toast.error("Please fill in all required fields and select a file")
      return
    }

    if (!userId) {
      toast.error("Please sign in to upload models")
      return
    }

    try {
      setIsUploading(true)

      // Upload GLB file to Appwrite Storage
      const fileUpload = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      )

      // Upload image if provided
      let imageUrl = ""
      if (image) {
        const imageUpload = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          image
        )
        imageUrl = imageUpload.$id
      }

      // Create document in Appwrite Database
      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          modelName: `${companyName} ${carName}`,
          modelPath: fileUpload.$id,
          slug: `${companyName.toLowerCase()}-${carName.toLowerCase()}`.replace(/\s+/g, '-'),
          imageUrl: imageUrl,
          fileId: fileUpload.$id,
          uploadDate: new Date().toISOString(),
          userId: userId
        }
      )

      toast.success("Model uploaded successfully!")
      onUploadComplete()
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload model")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="car-name">Car Name *</Label>
        <Input
          id="car-name"
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
          placeholder="e.g., Model S"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-name">Company Name *</Label>
        <Input
          id="company-name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g., Tesla"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Year (Optional)</Label>
        <Input
          id="year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g., 2024"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model-file">GLB File *</Label>
        <Input
          id="model-file"
          type="file"
          accept=".glb"
          onChange={handleFileChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="car-image">Car Image (Optional)</Label>
        <Input
          id="car-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={imagePreview}
              alt="Car preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <Button 
        className="w-full" 
        onClick={handleUpload} 
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Model"}
      </Button>
    </div>
  )
} 