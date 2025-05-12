// // /app/view/[carId]/page.tsx

// import { getConfigById } from "@/lib/mongodb"; // Your db fetching logic
// import { notFound } from "next/navigation";
// import CarViewer from "@/components/carViewer"; // Simple Car component without customizer

// export default async function ViewCarPage({ params }: { params: { carId: string } }) {
//   const config = await getConfigById(params.carId);

//   if (!config) {
//     notFound();
//   }

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center">
//       <CarViewer config={config} />
//     </main>
//   );
// }
