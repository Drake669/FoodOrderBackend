import mongoose, { Schema, Document } from "mongoose";
import { FoodDocument } from "./Food";

export interface OrderDocument extends Document {
  items: { food: FoodDocument; unit: number }[];
  vendorId: string;
  totalAmount: number;
  paidThrough: string;
  paymentResponse: string;
  orderStatus: string;
  deliveryId: string;
  remarks: string;
  readyTime: number; // in minutes
  appliedOffers: boolean;
  offerId: string;
}

const OrderSchema = new Schema(
  {
    items: {
      type: [
        {
          food: {
            ref: "Food",
            required: true,
            type: mongoose.SchemaTypes.ObjectId,
          },
          unit: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
    vendorId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidThrough: { type: String, required: true },
    paymentResponse: { type: String },
    orderStatus: { type: String },
    deliveryId: { type: String },
    remarks: { type: String },
    readyTime: { type: Number }, // in minutes
    appliedOffers: { type: Boolean },
    offerId: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

const Order = mongoose.model<OrderDocument>("Order", OrderSchema);

export { Order };
