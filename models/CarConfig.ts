// import { Schema, model, models } from 'mongoose';

// const CarConfigSchema = new Schema({
//   userId: { type: String, required: true },
//   carName: String,
//   config: {
//     color: Schema.Types.Mixed, // for gradient or solid
//     wheels: String,
//     accessories: [String],
//     headlights: String,
//     interiorColor: String,
//     wheelScale: Number,

//     // Add more config properties as needed
//   },
//   isShared: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: Date,
// });

// export const CarConfig = models.CarConfig || model('CarConfig', CarConfigSchema);


import mongoose from 'mongoose'

const CarConfigSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String },
  userName: { type: String },
  modelName: { type: String },
  modelPath: { type: String },
  bodyColor: { type: String },
  wheelColor: { type: String },
  wheelScale: { type: Number },
  finishType: { type: String },
  wheels: { type: String },
  headlights: { type: String },
  interiorColor: { type: String },
  accessories: [{ type: String }],
  isShared: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export const CarConfig =
  mongoose.models.CarConfig || mongoose.model('CarConfig', CarConfigSchema)
