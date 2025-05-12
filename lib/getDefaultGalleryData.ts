// lib/getDefaultGalleryData.ts
import { connectToDB } from "@/lib/mongodb";
import DefaultCar from "@/models/DefaultCar";

export async function getDefaultGalleryData() {
  await connectToDB();
  const cars = await DefaultCar.find();

  return cars.map((car) => ({
    title: car.name,
    image: "/assets/thumbnail.png", // or derive from glbPath
    modelPath: car.glbPath,
  }));
}
