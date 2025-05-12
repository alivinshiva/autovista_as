"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CarType } from "@/types/car"

interface AccessorySelectorProps {
  selectedWheels: string
  selectedHeadlights: string
  selectedInteriorColor: string
  onChange: (type: keyof CarType, value: string) => void
}

// Wheel options
const wheelOptions = [
  { value: "standard", label: "Standard", image: "/placeholder.svg?height=50&width=50" },
  { value: "sport", label: "Sport", image: "/placeholder.svg?height=50&width=50" },
  { value: "luxury", label: "Luxury", image: "/placeholder.svg?height=50&width=50" },
  { value: "offroad", label: "Off-Road", image: "/placeholder.svg?height=50&width=50" },
]

// Headlight options
const headlightOptions = [
  { value: "standard", label: "Standard" },
  { value: "led", label: "LED" },
  { value: "xenon", label: "Xenon" },
  { value: "matrix", label: "Matrix LED" },
]

// Interior color options
const interiorColorOptions = [
  { value: "#1e293b", label: "Dark" },
  { value: "#f8fafc", label: "Light" },
  { value: "#7f1d1d", label: "Red" },
  { value: "#172554", label: "Blue" },
]

export default function AccessorySelector({
  selectedWheels,
  selectedHeadlights,
  selectedInteriorColor,
  onChange,
}: AccessorySelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base mb-2 block">Wheels</Label>
        <RadioGroup
          defaultValue={selectedWheels}
          onValueChange={(value) => onChange("wheels", value)}
          className="grid grid-cols-2 gap-4"
        >
          {wheelOptions.map((wheel) => (
            <div key={wheel.value} className="flex flex-col items-center">
              <RadioGroupItem value={wheel.value} id={`wheel-${wheel.value}`} className="peer sr-only" />
              <Label
                htmlFor={`wheel-${wheel.value}`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:border-accent peer-data-[state=checked]:border-primary cursor-pointer w-full"
              >
                <img
                  src={wheel.image || "/placeholder.svg"}
                  alt={wheel.label}
                  className="w-16 h-16 object-contain mb-2"
                />
                <span className="text-sm font-medium">{wheel.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="headlights" className="text-base mb-2 block">
          Headlights
        </Label>
        <Select value={selectedHeadlights} onValueChange={(value) => onChange("headlights", value)}>
          <SelectTrigger id="headlights">
            <SelectValue placeholder="Select headlight type" />
          </SelectTrigger>
          <SelectContent>
            {headlightOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base mb-2 block">Interior Color</Label>
        <RadioGroup
          defaultValue={selectedInteriorColor}
          onValueChange={(value) => onChange("interiorColor", value)}
          className="grid grid-cols-4 gap-2"
        >
          {interiorColorOptions.map((color) => (
            <div key={color.value} className="flex flex-col items-center">
              <RadioGroupItem value={color.value} id={`interior-${color.value}`} className="peer sr-only" />
              <Label
                htmlFor={`interior-${color.value}`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-2 hover:border-accent peer-data-[state=checked]:border-primary cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-full border border-slate-300"
                  style={{ backgroundColor: color.value }}
                />
                <span className="mt-1 text-xs">{color.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

