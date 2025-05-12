"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, PresentationControls, useGLTF } from "@react-three/drei"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { getImageUrl, getAllImages } from "@/lib/appwrite"
import { Models } from "appwrite"

import {
  ChevronRight,
  Car,
  Palette,
  Cog,
  Upload,
  Moon,
  Sun,
} from "lucide-react";

import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs"
import { Gallery } from "@/components/gallery"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [carImages, setCarImages] = useState<Models.File[]>([])

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getAllImages()
        console.log("Fetched images:", images)
        setCarImages(images)
      } catch (error) {
        console.error("Error fetching images:", error)
      }
    }
    fetchImages()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCustomizeClick = () => {
    if (isSignedIn) {
      router.push("/customize")
    } else {
      router.push("/sign-in")
    }
  }

  const carData = [
    {
      title: "Mahindra Thar",
      src: carImages[0] ? getImageUrl(carImages[0].$id) : "/assets/image/amjith-s-8G4hNKdu60M-unsplash.jpg",
      description: "A rugged, all-black Mahindra Thar showcasing its off-road capabilities and commanding presence.",
    },
    {
      title: "Toyota Supra Mk IV",
      src: carImages[1] ? getImageUrl(carImages[1].$id) : "/assets/image/anastase-maragos-Lrfuy93_hAc-unsplash.jpg",
      description: "Iconic sports car with a sleek, aerodynamic design and powerful performance capabilities.",
      link: "/car/bmw",
    },
    {
      title: "Land Rover Defender",
      src: carImages[2] ? getImageUrl(carImages[2].$id) : "/assets/image/karsten-winegeart-afDsNrec8gI-unsplash.jpg",
      description: "Premium off-road SUV combining luxury with exceptional terrain-conquering capabilities.",
      link: "/car/lambo",
    },
    {
      title: "Tesla Roadster",
      src: carImages[3] ? getImageUrl(carImages[3].$id) : "/assets/image/tesla-fans-schweiz-7_OQMgoGzDw-unsplash.jpg",
      description: "Revolutionary electric sports car setting new standards in performance and innovation.",
      link: "/car/tesla",
    },
    {
      title: "Dodge Ram 1500",
      src: carImages[4] ? getImageUrl(carImages[4].$id) : "/assets/image/stevosdisposable-6DnSGv4VZlo-unsplash.jpg",
      description: "Powerful full-size pickup truck offering unmatched towing capacity and premium comfort.",
      link: "/car/dodge",
    },  
    {
      title: "AC Cobra",
      src: carImages[5] ? getImageUrl(carImages[5].$id) : "/assets/image/live-car-p635p3cj7x0qkf44.jpg",
      description: "Legendary British sports car known for its raw power and timeless design.",
      link: "/car/ac",
    },
  ];

  const projects = [
    {
      title: "Interactive 3D Viewer",
      description:
        "Explore every angle of your car with our interactive 3D model viewer powered by Three.js.",

    },
    {
      title: "Color Customization",
      description: "Choose from a wide range of colors or create your own custom shade for the perfect look.",

    },
    {
      title: "Accessory Customization"
      , description: "Personalize wheels, headlights, and interior colors to match your style preferences.",

    },
    {
      title: "Upload Your Models",
      description: "Import your own 3D models created in Blender or other 3D software for customization.",

    },
    {
      title: "Light & Dark Mode",
      description: "Enjoy a comfortable viewing experience with support for both light and dark themes.",

    },
    {
      title: "Save & Share",
      description: "Save your customizations and share them with friends or download for future reference.",

    },
  ];

  const words = [
    {
      text: "Customize",
    },
    {
      text: "Your",
    },
    {
      text: "Car",
    },
    {
      text: "With",
    },
    {
      text: "Fun",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  function CarModel() {
    const { scene } = useGLTF("https://nyc.cloud.appwrite.io/v1/storage/buckets/681f9eb2001fa04ba001/files/681fad9a00219322c51e/view?project=681f9cc80018c9d0397a")
    return (
      <primitive
        object={scene}
        scale={[3, 3.2, 3.3]}
        position={[0, -2, 0]}
        rotation={[0, Math.PI / 4, 0]}
      />
    )
  }

  function FeatureCard({
    icon: Icon,
    title,
    description,
    delay,
  }: {
    icon: any
    title: string
    description: string
    delay: number
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <Icon className="text-primary w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b z-50 relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AutoVista</span>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-foreground/80 hover:text-foreground">Features</a>
              <a href="#upload" className="text-foreground/80 hover:text-foreground">Model Gallery</a>
              <a onClick={handleCustomizeClick} className="cursor-pointer text-foreground/80 hover:text-foreground">
                Customize
              </a>
            </nav>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 relative bg-gradient-to-br from-white via-gray-100 to-white dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Canvas className="w-full h-full !bg-transparent" shadows camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <PresentationControls global polar={[-Math.PI / 4, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}>
                  <CarModel />
                </PresentationControls>
                <Environment preset="city" />
              </Canvas>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg text-white">
              Customize Your Dream Car in 3D
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg drop-shadow-md">
              AutoVista lets you visualize and personalize your car with our interactive 3D customization platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Button size="lg" className="group relative z-10" onClick={handleCustomizeClick}>
                Start Customizing
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" asChild className="relative z-10">
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Customization Features
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} viewport={{ once: true }} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to visualize and personalize your dream car
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            <FeatureCard icon={Car} title="Interactive 3D Viewer" description="Explore every angle of your car with our interactive 3D model viewer powered by Three.js." delay={0.2} />
            <FeatureCard icon={Palette} title="Color Customization" description="Choose from a wide range of colors or create your own custom shade for the perfect look." delay={0.3} />
            <FeatureCard icon={Cog} title="Accessory Customization" description="Personalize wheels, headlights, and interior colors to match your style preferences." delay={0.4} />
            <FeatureCard icon={Upload} title="Upload Your Models" description="Import your own 3D models created in Blender or other 3D software for customization." delay={0.5} />
            <FeatureCard icon={Sun} title="Light & Dark Mode" description="Enjoy a comfortable viewing experience with support for both light and dark themes." delay={0.6} />
            <FeatureCard icon={ChevronRight} title="Save & Share" description="Save your customizations and share them with friends or download for future reference." delay={0.7} />
          </div>


          {/* hover Effect iin features section */}
          {/* <div className="max-w-5xl mx-auto px-8  lg:grid-cols-3 gap-8">
            <HoverEffect items={projects} />
          </div> */}

        </div>
      </section>

      <section id="upload" className="w-full px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
            The road to freedom starts from here
          </p>
          <TypewriterEffectSmooth words={words} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carData.map((car, index) => (
            <Gallery key={index} car={car} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-400 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Customize Your Dream Car?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} viewport={{ once: true }} className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Jump into our 3D customization platform and bring your vision to life.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} viewport={{ once: true }}>
            <Button size="lg" variant="secondary" className="group" onClick={handleCustomizeClick}>
              Start Customizing Now
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">AutoVista</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Contact Us</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">© 2025 AutoVista. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
