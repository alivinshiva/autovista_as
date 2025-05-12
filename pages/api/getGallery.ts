// import { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "@/lib/mongodb";
// import Car from "@/models/carConfig";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

//   try {
//     await connectToDatabase();

//     const sharedCars = await Car.find({ shared: true });
//     res.status(200).json(sharedCars);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch gallery data." });
//   }
// }
