import mongoose, { Document, Model, Schema } from "mongoose";
import { FoodDocument } from "./Food";

export interface VendorDocument extends Document {
  name: string;
  ownerName: string;
  foodType: string[];
  pincode: string;
  address: string;
  phoneNumber: string;
  email: string;
  password: string;
  salt: string;
  foods: FoodDocument[];
  rating: number;
  serviceAvailable: boolean;
  coverImages: string[];
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    phoneNumber: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    foods: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Food" }],
    rating: { type: Number },
    serviceAvailable: { type: Boolean },
    coverImages: { type: [String] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.pincode;
      },
    },
  }
);

const Vendor = mongoose.model<VendorDocument>("Vendor", VendorSchema);

export { Vendor };
