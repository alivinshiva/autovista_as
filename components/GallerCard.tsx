'use client';

import React from "react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface GalleryItem {
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

export function HoverEffect({ items, onView }: { items: GalleryItem[]; onView: (item: GalleryItem) => void }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, idx) => (
        <CardContainer key={item.id ?? idx} className="inter-var">
          <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
            <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
              {item.title}
            </CardItem>
            <CardItem translateZ="60" as="p" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
              {item.description}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <div className="relative h-60 w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover rounded-xl group-hover/card:shadow-xl"
                  unoptimized
                />
              </div>
            </CardItem>

            <div className="flex justify-between items-center mt-6">
              <CardItem
                translateZ={20}
                as="button"
                onClick={() => onView(item)}
                className="px-4 py-2 rounded-xl bg-gray-200 text-black text-xs font-bold hover:bg-gray-300"
              >
                View
              </CardItem>

              <CardItem
                translateZ={20}
                as="button"
                onClick={() => router.push(item.customizeLink)}
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:opacity-80"
              >
                Customize
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
}
