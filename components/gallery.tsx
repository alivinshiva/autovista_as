"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";

type CarData = {
    title: string;
    src: string;
    description?: string;
    link?: string;
};

interface GalleryProps {
    car: CarData;
}

export function Gallery({ car }: GalleryProps) {
    return (
        <CardContainer className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
                <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                    {car.title}
                </CardItem>
                <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                    {car.description || "Hover over this card to unleash the power of CSS perspective"}
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                    <div className="relative h-60 w-full">
                        <Image
                            src={car.src}
                            alt={`${car.title} thumbnail`}
                            fill
                            className="object-cover rounded-xl group-hover/card:shadow-xl"
                            unoptimized
                        />
                    </div>
                </CardItem>
                <div className="flex justify-between items-center mt-6">
                    <CardItem
                        translateZ={20}
                        as="a"
                        href={car.link || "#"}
                        target="_blank"
                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                    >
                        View →
                    </CardItem>
                    <CardItem
                        translateZ={20}
                        as="button"
                        className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                    >
                        Customize
                    </CardItem>
                </div>
            </CardBody>
        </CardContainer>
    );
}

