'use client';

import { useEffect, useState } from 'react';
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { HoverEffect } from "@/components/GallerCard";
import Link from 'next/link';
import { getAllCarModels, getImageUrl } from '@/lib/appwrite'
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import CarViewer from '@/components/car-viewer';

interface CarModel {
  id: string;
  title: string;
  src: string;
  alt: string;
  description: string;
  customizeLink: string;
  viewLink: string;
  userId?: string;
  isCustom?: boolean;
  fileId: string;
  modelPath: string;
  bodyColor?: string;
  wheelColor?: string;
  wheelScale?: number;
}

const PLACEHOLDER_IMAGE = '/assets/image/placeholder-car.jpg'; // Make sure this exists or use any placeholder

export default function GalleryPage() {
  const { user } = useUser();
  const [carData, setCarData] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);
  const [modelUrl, setModelUrl] = useState<string>('');
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [savedConfig, setSavedConfig] = useState<any>(null);

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const models = await getAllCarModels();
        
        const carModels = models.map(model => {
          let imageUrl = '';
          if (model.imageUrl) {
            imageUrl = getImageUrl(model.imageUrl);
          }
          return {
            id: model.$id,
            title: model.modelName,
            src: imageUrl || PLACEHOLDER_IMAGE,
            alt: model.modelName,
            description: `${model.companyName || ''} ${model.year || ''}`.trim(),
            customizeLink: `/customize/${model.slug}`,
            viewLink: `/view/${model.slug}`,
            userId: model.userId,
            isCustom: model.isCustom,
            fileId: model.fileId,
            modelPath: model.modelPath,
            bodyColor: model.bodyColor || "#ffffff",
            wheelColor: model.wheelColor || "#000000",
            wheelScale: model.wheelScale || 1
          };
        });

        // Show pre-uploaded models (userId === "owner") and user's own models
        const filteredModels = carModels.filter(model => {
          return model.userId === "owner" || model.userId === user?.id;
        });
        
        setCarData(filteredModels);
      } catch (error) {
        console.error('Error fetching car models:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, [user?.id]); // Re-fetch when user changes

  const handleView = async (model: CarModel) => {
    setSelectedModel(model);
    setIsLoadingModel(true);
    try {
      // Fetch the model URL
      const fileId = model.modelPath.split('/').pop() || model.modelPath;
      const response = await fetch(`/api/models/${fileId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load model');
      }
      
      setModelUrl(data.url);

      // Fetch saved configuration if it exists
      const configResponse = await fetch(`/api/get-config?modelId=${model.fileId}`);
      const configData = await configResponse.json();
      if (configData.success && configData.config) {
        setSavedConfig(configData.config);
      } else {
        setSavedConfig(null);
      }
    } catch (error) {
      console.error('Error loading model:', error);
      toast.error('Failed to load model');
    } finally {
      setIsLoadingModel(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center shadow-md bg-white dark:bg-neutral-900 sticky top-0 z-50">
        <div className="text-2xl font-bold text-red-500">
          Auto<span className="text-black dark:text-white">Vista</span>
        </div>
        <div className="hidden md:flex gap-8">
          <Link href="/" className="text-neutral-700 dark:text-neutral-200 hover:text-red-500 transition">
            Home
          </Link>
          <Link href="/customize" className="text-neutral-700 dark:text-neutral-200 hover:text-red-500 transition">
            Customize
          </Link>
          {/* <Link href="/upload" className="text-neutral-700 dark:text-neutral-200 hover:text-red-500 transition">
            Upload
          </Link> */}
        </div>
      </nav>
      {/* Gallery Section */}
      <section className="w-full px-4 py-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <TypewriterEffectSmooth
            words={[
              { text: "Explore", className: "text-black" },
              { text: "Cars", className: "text-red-500" }
            ]}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : carData.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No car models found. Upload some models to see them here!
          </div>
        ) : (
          <HoverEffect items={carData} onView={handleView} />
        )}
      </section>

      {/* View Dialog */}
      <Dialog open={!!selectedModel} onOpenChange={() => setSelectedModel(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogTitle className="text-2xl font-bold mb-2">
            {selectedModel?.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mb-4">
            {selectedModel?.description}
          </DialogDescription>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="h-[400px] lg:h-full">
              {isLoadingModel ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <CarViewer
                  modelPath={modelUrl}
                  bodyColor={savedConfig?.bodyColor || selectedModel?.bodyColor || "#ffffff"}
                  wheelColor={savedConfig?.wheelColor || selectedModel?.wheelColor || "#000000"}
                  finish="glossy"
                  wheelScale={savedConfig?.wheelScale ? parseFloat(savedConfig.wheelScale) : selectedModel?.wheelScale || 1}
                />
              )}
            </div>
            <div className="space-y-4">
              {savedConfig && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Saved Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Body Color</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border" 
                          style={{ backgroundColor: savedConfig.bodyColor }}
                        />
                        <span>{savedConfig.bodyColor}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wheel Color</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border" 
                          style={{ backgroundColor: savedConfig.wheelColor }}
                        />
                        <span>{savedConfig.wheelColor}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wheel Size</p>
                      <span>{savedConfig.wheelScale}x</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Link 
                  href={selectedModel?.customizeLink || '#'}
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-bold"
                >
                  Customize
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
