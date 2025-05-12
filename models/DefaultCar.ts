// models/DefaultCar.ts
import mongoose from "mongoose";

const DefaultCarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  glbPath: { type: String, required: true }, // like /assets/3d/demo/car1.glb
});

const DefaultCar = mongoose.models.DefaultCar || mongoose.model("DefaultCar", DefaultCarSchema);

export default DefaultCar;
