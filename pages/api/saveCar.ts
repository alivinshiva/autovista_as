// import { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "@/lib/mongodb";
// import Car from "@/models/CarConfig";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

//   try {
//     await connectToDatabase();

//     const { userId, modelPath, bodyColor, wheelColor, accessories, shared } = req.body;

//     const newCar = new Car({
//       userId,
//       modelPath,
//       bodyColor,
//       wheelColor,
//       accessories,
//       shared,
//     });

//     await newCar.save();
//     res.status(201).json({ message: "Car saved successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to save car configuration." });
//   }
// }
