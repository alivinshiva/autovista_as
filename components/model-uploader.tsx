"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileUp, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ModelUploaderProps {
  onModelUpload: (modelPath: string) => void
}

export default function ModelUploader({ onModelUpload }: ModelUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    // Check if file is a 3D model (glb or gltf)
    if (!file.name.match(/\.(glb|gltf)$/i)) {
      setUploadStatus("error")
      setErrorMessage("Please upload a GLB or GLTF file")
      return
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setUploadStatus("error")
      setErrorMessage("File size exceeds 50MB limit")
      return
    }

    // Simulate file upload
    setUploadStatus("uploading")
    setUploadProgress(0)

    // In a real app, you would upload the file to a server
    // For this demo, we'll simulate progress and use the duck model
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          // In a real app, the server would return the path to the uploaded model
          // For this demo, we'll just use the duck model
            onModelUpload("/assets/3d/duck.glb")
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const resetUpload = () => {
    setUploadStatus("idle")
    setUploadProgress(0)
    setErrorMessage("")
  }

  // Sample models to choose from
  const sampleModels = [
    { name: "Duck", path: "/assets/3d/duck.glb" },
    { name: "Default Car", path: "/assets/3d/duck.glb" }, // Using duck as placeholder
  ]


  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-base font-medium">Upload Your 3D Model</h3>
        <p className="text-sm text-muted-foreground">Upload your own 3D model in GLB or GLTF format (max 50MB)</p>
      </div>

      {uploadStatus === "idle" && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Drag and drop your 3D model here</h3>
          <p className="text-sm text-muted-foreground mb-4">Supports GLB, GLTF formats</p>
          <div className="relative">
            <input
              type="file"
              accept=".glb,.gltf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileSelect}
            />
            <Button>Select File</Button>
          </div>
        </div>
      )}

      {uploadStatus === "uploading" && (
        <div className="border rounded-lg p-6 text-center">
          <FileUp className="h-8 w-8 mx-auto text-primary mb-4 animate-pulse" />
          <h3 className="text-lg font-medium mb-2">Uploading model...</h3>
          <Progress value={uploadProgress} className="mb-4" />
          <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="border rounded-lg p-6 text-center">
          <Check className="h-8 w-8 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Complete!</h3>
          <p className="text-sm text-muted-foreground mb-4">Your 3D model has been uploaded successfully.</p>
          <Button variant="outline" onClick={resetUpload}>
            Upload Another
          </Button>
        </div>
      )}

      {uploadStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
          <Button variant="outline" size="sm" onClick={resetUpload} className="mt-2">
            Try Again
          </Button>
        </Alert>
      )}

      <div className="pt-4 border-t">
        <h3 className="text-base font-medium mb-3">Or choose from sample models</h3>
        <div className="grid grid-cols-2 gap-3">
          {sampleModels.map((model) => (
            <Button
              key={model.path}
              variant="outline"
              className="h-auto py-3 px-4 flex flex-col items-center"
              onClick={() => onModelUpload(model.path)}
            >
              <span className="text-sm font-medium">{model.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

