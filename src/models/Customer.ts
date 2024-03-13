import mongoose, { Document, Model, Schema } from "mongoose";
import { OrderDocument } from "./Order";

export interface CustomerDocument extends Document {
  email: string;
  password: string;
  phone_number: string;
  salt: string;
  otp: number;
  otp_expiry: Date;
  first_name: string;
  last_name: string;
  address: string;
  verified: boolean;
  lgn: string;
  lat: string;
  cart: any[];
  orders: OrderDocument[];
}

const CustomerSchema = new Schema(
  {
    email: { type: String, required: true },
    address: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    lgn: { type: String },
    lat: { type: String },
    verified: { type: Boolean },
    first_name: { type: String },
    last_name: { type: String },
    otp: { type: Number },
    otp_expiry: { type: Date },
    orders: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Order",
      },
    ],
    cart: [
      {
        food: { type: mongoose.SchemaTypes.ObjectId, ref: "Food" },
        unit: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
  }
);

const Customer = mongoose.model<CustomerDocument>("Customer", CustomerSchema);

export { Customer };
