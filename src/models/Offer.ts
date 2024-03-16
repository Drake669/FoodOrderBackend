import mongoose, { Document, Schema } from "mongoose";
import { FoodDocument } from "./Food";
import { CustomerDocument } from "./Customer";
import { VendorDocument } from "./Vendor";

export interface OfferDocument extends Document {
  offerType: "ADMIN" | "GENERIC";
  offerName: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  promoCode: string;
  offerPercentage: number;
  promoType: "FOOD" | "USER" | "BANK" | "CARD" | "ALL";
  banks: string[];
  food: FoodDocument[];
  users: CustomerDocument[];
  bins: number[];
  vendors: VendorDocument[];
  minValue: number;
}

const offerSchema = new Schema({
  offerType: { type: String, required: true },
  offerName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, required: true },
  promoCode: { type: String, required: true },
  offerPercentage: { type: Number, required: true },
  promoType: { type: String, required: true },
  banks: [
    {
      type: String,
    },
  ],
  food: [
    {
      type: Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
  ],
  bins: [
    {
      type: Number,
    },
  ],
  vendors: [
    {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
  ],
  minValue: {
    type: Number,
    required: true,
  },
});

const Offer = mongoose.model<OfferDocument>("Offer", offerSchema);

export { Offer };
