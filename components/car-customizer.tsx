"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Stage } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2, Trash2 } from "lucide-react"
import ColorPicker from "@/components/color-picker"
import AccessorySelector from "@/components/accessory-selector"
import ThemeToggle from "@/components/theme-toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { getAllCarModels, deleteCarModelAndFiles } from '@/lib/appwrite'
import { Models } from 'appwrite'
import { Html } from "@react-three/drei"
import { useRouter } from "next/navigation"
import ModelUpload from "./model-upload"

interface CarModel extends Models.Document {
  modelName: string
  modelPath: string
  slug: string
  imageUrl: string
  fileId: string
  companyName: string
  year?: string
  userId?: string
  isCustom?: boolean
}

interface CarConfig {
  bodyColor: string
  wheelColor: string
  wheels: string
  headlights: string
  interiorColor: string
  zoom: number
  modelPath: string
  modelName: string
  finish: "glossy" | "matte"
  wheelScale: number
  imageUrl: string
  fileId: string
}

interface CarProps {
  bodyColor: string;
  wheelColor: string;
  modelPath: string;
  finish: "glossy" | "matte";
  wheelScale: number;
}

interface ModelViewerProps {
  modelUrl: string;
  bodyColor: string;
  wheelColor: string;
  finish: "glossy" | "matte";
  wheelScale: number;
}

function Car({ bodyColor, wheelColor, modelPath, finish, wheelScale }: CarProps) {
  const [modelUrl, setModelUrl] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true)
        setError('')
        // Extract file ID from modelPath if it's a full URL
        const fileId = modelPath.split('/').pop() || modelPath
        const response = await fetch(`/api/models/${fileId}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load model')
        }
        
        setModelUrl(data.url)
      } catch (error) {
        console.error('Error loading model:', error)
        setError(error instanceof Error ? error.message : 'Failed to load model')
      } finally {
        setIsLoading(false)
      }
    }

    if (modelPath) {
      loadModel()
    }
  }, [modelPath])

  if (isLoading) {
    return <Html center><div>Loading model...</div></Html>
  }

  if (error) {
    return <Html center><div className="text-red-500">{error}</div></Html>
  }

  if (!modelUrl) {
    return <Html center><div>No model selected</div></Html>
  }

  return <ModelViewer 
    modelUrl={modelUrl} 
    bodyColor={bodyColor} 
    wheelColor={wheelColor} 
    finish={finish} 
    wheelScale={wheelScale} 
  />
}

function ModelViewer({ modelUrl, bodyColor, wheelColor, finish, wheelScale }: ModelViewerProps): JSX.Element {
  const { scene } = useGLTF(modelUrl)

  useEffect(() => {
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        const nodeName = node.name.toLowerCase()

        if (nodeName.includes("wheel") || nodeName.includes("tire")) {
          node.material.color.set(wheelColor)
          node.scale.set(wheelScale, wheelScale, wheelScale)
          const offsetY = (wheelScale - 1) * -0.1
          node.position.y = offsetY
        }

        if (nodeName.includes("body") || nodeName.includes("chassis") || (nodeName.includes("car") && !nodeName.includes("wheel"))) {
          node.material.color.set(bodyColor)
          node.material.metalness = finish === "glossy" ? 0.8 : 0.1
          node.material.roughness = finish === "glossy" ? 0.2 : 0.7
          node.material.needsUpdate = true
        }
      }
    })
  }, [bodyColor, wheelColor, finish, wheelScale, scene])

  return (
    <primitive
      object={scene}
      scale={[2.5, 2.5, 2.5]}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  )
}

interface CarCustomizerProps {
  slug?: string;
}

export default function CarCustomizer({ slug }: CarCustomizerProps) {
  const { user } = useUser()
  const router = useRouter()
  const [models, setModels] = useState<CarModel[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const [carConfig, setCarConfig] = useState<CarConfig>({
    bodyColor: "#ffffff",
    wheelColor: "#000000",
    wheels: "default",
    headlights: "default",
    interiorColor: "#1e293b",
    zoom: 2.5,
    modelPath: "",
    modelName: "",
    finish: "glossy",
    wheelScale: 1,
    imageUrl: "",
    fileId: "",
  })

  const [isSaving, setIsSaving] = useState(false)

  const fetchModels = async () => {
    try {
      setLoading(true);
      const carModels = await getAllCarModels();
      
      const typedModels = carModels.map(model => ({
        ...model,
        modelName: model.modelName || '',
        modelPath: model.modelPath || '',
        slug: model.slug || '',
        imageUrl: model.imageUrl || '',
        fileId: model.fileId || '',
        companyName: model.companyName || '',
        year: model.year || '',
        userId: model.userId || '',
        isCustom: model.isCustom || false,
      })) as CarModel[];

      // Show pre-uploaded models (userId === "owner") and user's own models
      const filteredModels = typedModels.filter(model => {
        return model.userId === "owner" || model.userId === user?.id;
      });
      
      setModels(filteredModels);
      
      if (filteredModels.length > 0) {
        if (slug) {
          const modelBySlug = filteredModels.find(m => m.slug === slug);
          if (modelBySlug) {
            setSelectedModel(modelBySlug.fileId);
            setCarConfig((prev) => ({
              ...prev,
              modelPath: modelBySlug.modelPath,
              modelName: modelBySlug.modelName,
              imageUrl: modelBySlug.imageUrl,
              fileId: modelBySlug.fileId,
            }));
            return;
          }
        }
        const firstModel = filteredModels[0];
        setSelectedModel(firstModel.fileId);
        setCarConfig((prev) => ({
          ...prev,
          modelPath: firstModel.modelPath,
          modelName: firstModel.modelName,
          imageUrl: firstModel.imageUrl,
          fileId: firstModel.fileId,
        }));
      }
    } catch (error) {
      console.error('Error fetching car models:', error);
      toast.error('Failed to load car models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [slug, user?.id]); // Re-fetch when user changes

  const handleUploadComplete = () => {
    fetchModels();
  };

  // Filter models based on user ID
  const preUploadedModels = models.filter(model => model.userId === "owner");
  const userModels = models.filter(model => model.userId === user?.id);

  const handleZoomChange = (value: number[]) => {
    setCarConfig((prev) => ({ ...prev, zoom: value[0] }))
  }

  const handleModelChange = (newModelPath: string) => {
    const selectedModel = models.find((m: CarModel) => m.modelPath === newModelPath)
    if (selectedModel) {
      setCarConfig((prev) => ({
        ...prev,
        modelPath: selectedModel.modelPath,
        modelName: selectedModel.modelName,
        imageUrl: selectedModel.imageUrl,
        fileId: selectedModel.fileId,
      }))
      // Update the URL with the new model slug
      router.push(`/customize/${selectedModel.slug}`)
    }
  }

  const handleDeleteModel = async (model: CarModel) => {
    console.log('Delete button clicked for model:', model);
    
    if (!confirm(`Are you sure you want to delete ${model.modelName}?`)) {
      console.log('Delete cancelled by user');
      return;
    }

    try {
      console.log('Starting delete process...');
      setLoading(true);
      
      console.log('Model details:', {
        modelId: model.$id,
        fileId: model.fileId,
        imageUrl: model.imageUrl,
        modelName: model.modelName
      });
      
      // Call the delete function
      const result = await deleteCarModelAndFiles(model.$id, model.fileId, model.imageUrl);
      console.log('Delete result:', result);
      
      if (result) {
        console.log('Delete successful, updating UI...');
        // Show success message
        toast.success("Model deleted successfully");
        
        // Update the models list
        const updatedModels = models.filter(m => m.$id !== model.$id);
        setModels(updatedModels);
        
        // If the deleted model was selected, select another model
        if (model.fileId === carConfig.fileId) {
          const firstModel = updatedModels[0];
          if (firstModel) {
            setCarConfig(prev => ({
              ...prev,
              modelPath: firstModel.modelPath,
              modelName: firstModel.modelName,
              imageUrl: firstModel.imageUrl,
              fileId: firstModel.fileId,
            }));
          }
        }
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (error) {
      console.error("Error deleting model:", error);
      toast.error("Failed to delete model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    try {
      const payload = {
        userId: user?.id,
        userEmail: user?.emailAddresses[0]?.emailAddress,
        userName: user?.fullName,
        modelId: carConfig.fileId,
        modelName: carConfig.modelName,
        bodyColor: carConfig.bodyColor,
        wheelColor: carConfig.wheelColor,
        wheelScale: carConfig.wheelScale.toString(),
        isShared: "false",
        createdAt: new Date().toISOString()
      };

      const response = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to save configuration");
      }

      toast.success("Configuration saved successfully!");
    } catch (error: any) {
      console.error("Error saving configuration:", error);
      toast.error("Error saving configuration: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-muted/30 rounded-lg overflow-hidden shadow-sm h-[500px] lg:h-[700px] relative">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          }>
            <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
              <Stage environment="studio" intensity={0.5}>
                <Car {...carConfig} />
              </Stage>
              <OrbitControls enableZoom={true} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
              <Environment preset="city" />
            </Canvas>
          </Suspense>
        )}
      </div>

      <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 scrollbar-hide">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Customize Your Car</h2>

            <Tabs defaultValue="color">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="color">Color</TabsTrigger>
                <TabsTrigger value="accessories">Parts</TabsTrigger>
                <TabsTrigger value="model">Model</TabsTrigger>
                <TabsTrigger value="view">Add Model</TabsTrigger>
              </TabsList>

              <TabsContent value="color" className="space-y-4">
                <ColorPicker
                  bodyColor={carConfig.bodyColor}
                  wheelColor={carConfig.wheelColor}
                  onBodyColorChange={(color) => setCarConfig((prev) => ({ ...prev, bodyColor: color }))}
                  onWheelColorChange={(color) => setCarConfig((prev) => ({ ...prev, wheelColor: color }))}
                />

                <div className="space-y-2">
                  <Label htmlFor="finish">Finish</Label>
                  <Select
                    value={carConfig.finish}
                    onValueChange={(value) =>
                      setCarConfig((prev) => ({ ...prev, finish: value as "glossy" | "matte" }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Finish" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="glossy">Glossy</SelectItem>
                      <SelectItem value="matte">Matte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="accessories" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wheel-scale">Wheel Size</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      id="wheel-scale"
                      min={0.5}
                      max={1.2}
                      step={0.1}
                      value={[carConfig.wheelScale || 1]}
                      onValueChange={(value) => setCarConfig((prev) => ({ ...prev, wheelScale: value[0] }))}
                    />
                    <span className="text-sm font-mono w-10">{carConfig.wheelScale.toFixed(1)}x</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="model" className="space-y-4">
                <Label htmlFor="car-model">Select Car Model</Label>
                <Select onValueChange={handleModelChange} value={carConfig.modelPath}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Pre-uploaded Models */}
                    {preUploadedModels.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                          Pre-uploaded Models
                        </div>
                        {preUploadedModels.map((model: CarModel) => (
                          <SelectItem 
                            key={model.$id} 
                            value={model.modelPath}
                          >
                            {model.companyName} {model.modelName} {model.year ? `(${model.year})` : ''}
                          </SelectItem>
                        ))}
                      </>
                    )}
                    
                    {/* User's Custom Models */}
                    {userModels.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                          Your Models
                        </div>
                        {userModels.map((model: CarModel) => (
                          <div key={model.$id} className="relative group">
                            <div className="flex items-center justify-between w-full">
                              <SelectItem 
                                value={model.modelPath}
                                className="flex-1"
                              >
                                {model.companyName} {model.modelName} {model.year ? `(${model.year})` : ''}
                              </SelectItem>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteModel(model);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </TabsContent>

              <TabsContent value="view" className="space-y-4">
                <ModelUpload onUploadComplete={handleUploadComplete} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" onClick={saveConfiguration} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Configuration"
          )}
        </Button>
      </div>
    </div>
  )
}

