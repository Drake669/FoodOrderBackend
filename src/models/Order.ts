import mongoose, { Schema, Document } from "mongoose";
import { FoodDocument } from "./Food";

export interface OrderDocument extends Document {
  items: { food: FoodDocument; unit: number }[];
  totalAmount: number;
  paidThrough: string;
  paymentResponse: string;
  orderStatus: string;
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
    totalAmount: { type: Number, required: true },
    paidThrough: { type: String, required: true },
    paymentResponse: { type: String },
    orderStatus: { type: String },
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
