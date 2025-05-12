// scripts/saveDefaultCars.ts
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import DefaultCar from "@/models/DefaultCar"; // adjust path as needed
import { connectToDB } from "@/lib/mongodb"; // your MongoDB connect function

async function saveDefaultCars() {
    await connectToDB();

    const folderPath = path.join(process.cwd(), "public/assets/3d/demo");
    const files = fs.readdirSync(folderPath).filter((file) => file.endsWith(".glb"));

    for (const file of files) {
        const name = file.replace(".glb", "");
        const glbPath = `/assets/3d/${file}`;

        // Prevent duplicates
        const existing = await DefaultCar.findOne({ glbPath });
        if (!existing) {
            await DefaultCar.create({ name, glbPath });
            console.log(`Saved ${name} to DB`);
        } else {
            console.log(`${name} already exists`);
        }
    }

    console.log("Done");
    process.exit();
}

saveDefaultCars();
