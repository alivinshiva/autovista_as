"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAllCarModels } from "@/lib/appwrite";
import { Models } from "appwrite";

interface CarModel extends Models.Document {
  modelName: string;
  modelPath: string;
  slug: string;
  imageUrl: string;
  fileId: string;
}

function CustomizeRedirectPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fadeOut, setFadeOut] = useState(false);
  const [models, setModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const carModels = await getAllCarModels();
        const typedModels = carModels.map((model) => ({
          ...model,
          modelName: model.modelName || "",
          modelPath: model.modelPath || "",
          slug: model.slug || "",
          imageUrl: model.imageUrl || "",
          fileId: model.fileId || "",
        })) as CarModel[];

        setModels(typedModels);
      } catch (error) {
        console.error("Error fetching car models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    if (!loading && models.length > 0) {
      const carSlug = searchParams?.get("car");
      const defaultCar = models[0].slug;

      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 300);

      const redirectTimer = setTimeout(() => {
        router.replace(`/customize/${carSlug || defaultCar}`);
      }, 800);

      return () => {
        clearTimeout(timer);
        clearTimeout(redirectTimer);
      };
    }
  }, [loading, models, router, searchParams]);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AutoVista Customizer</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-primary transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                {/* <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </Link> */}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <div
          className={`transition-opacity duration-500 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <h1 className="text-3xl font-bold">
            {loading ? "Loading..." : "Redirecting..."}
          </h1>
        </div>
      </div>

      <footer className="border-t p-4 mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 AutoVista. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

export default function CustomizeRedirectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomizeRedirectPageInner />
    </Suspense>
  );
}
