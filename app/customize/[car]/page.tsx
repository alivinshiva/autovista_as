// import CarCustomizer from "@/components/car-customizer"

// export default function CustomizePage() {
//   return (
//     <main className="min-h-screen flex flex-col">
//       <header className="border-b p-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold">AutoVista Customizer</h1>
//           <nav>
//             <ul className="flex space-x-4">
//               <li>
//                 <a href="/" className="hover:text-primary">
//                   Home
//                 </a>
//               </li>
//               <li>
//                 <a href="/gallery" className="hover:text-primary">
//                   Gallery
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-primary">
//                   About
//                 </a>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </header>

//       <div className="flex-grow container mx-auto p-4">
//         <CarCustomizer />
//       </div>

//       <footer className="border-t p-4">
//         <div className="container mx-auto text-center text-sm text-muted-foreground">
//           <p>© 2025 AutoVista. All rights reserved.</p>
//         </div>
//       </footer>
//     </main>
//   )
// }

// app/customize/[car]/page.tsx
import CarCustomizer from "@/components/car-customizer"
import Link from "next/link"

interface CustomizePageProps {
  params: { car: string }
}

export default function CustomizePage({ params }: CustomizePageProps) {
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
                <Link href="/gallery" className="hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="flex-grow container mx-auto p-4">
        {/* Pass selected car slug to CarCustomizer */}
        <CarCustomizer slug={params.car} />
      </div>

      <footer className="border-t p-4 mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 AutoVista. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
