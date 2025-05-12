```md
# 🚗 Car Customizer App

A 3D Car Customizer web application built with **React**, **Three.js (via @react-three/fiber)**, and **Tailwind CSS**. Users can visually personalize a car model by changing body colors, wheel styles, finishes, and accessories in real-time.

---

## ✨ Features

- 🎨 **Real-time 3D Customization**
  - Change body and wheel colors
  - Toggle between glossy and matte finishes
- 🚗 **Multiple Car Models**
  - Sports car, classic car, truck, and a default duck model for fun
- 🛠️ **Accessory Selection**
  - Choose wheels, headlights, and interior colors
- 🔍 **Adjustable Camera View**
  - Zoom in/out for better detail
- 💾 **Save Configuration**
  - Store the current car setup in local storage
- 🌗 **Light/Dark Mode**
  - Built-in theme toggle support

---

## 📦 Tech Stack

- **React (Next.js App Router)**
- **Three.js** with `@react-three/fiber` and `@react-three/drei`
- **Tailwind CSS** for responsive UI
- **GLTF** models for 3D cars

---

## 📁 Folder Structure

```
/public/assets/3d
  - sports_car.glb
  - classic_car.glb
  - truck.glb
  - duck.glb

/components
  - CarCustomizer.tsx
  - ColorPicker.tsx
  - AccessorySelector.tsx
  - ThemeToggle.tsx
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/car-customizer.git
cd car-customizer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to view the app.

---

## 🛠 Adding New Car Models

To add a new `.glb` model:

1. Place the model in `public/assets/3d`.
2. Add an entry to the `carModels` array in `CarCustomizer.tsx`:

```ts
{ name: "New Model", path: "/assets/3d/new_model.glb" }
```

Make sure your GLB file follows the naming convention for wheels and body parts:
- `wheel`, `tire` → wheels
- `body`, `chassis`, `car` → car body

---

## 🧩 Customizing Accessories

Accessory selection logic can be extended in `AccessorySelector.tsx`. Currently it supports:
- Wheels
- Headlights
- Interior color

Add more options by updating the form and modifying how `Car` processes the selected accessories.

---

## 📄 License

MIT License.  
© 2025 Shivam Kumar

---

## 🙌 Acknowledgments

- [Three.js](https://threejs.org/)
- [react-three-fiber](https://docs.pmnd.rs/react-three-fiber)
- [drei](https://github.com/pmndrs/drei)
- [Tailwind CSS](https://tailwindcss.com/)
```
