import mongoose, { Document, Model, Schema } from "mongoose";

export interface CustomerDocument extends Document {
  email: string;
  password: string;
  phone_number: string;
  salt: string;
  otp: string;
  otp_expiry: Date;
  first_name: string;
  last_name: string;
  address: string;
  verified: boolean;
  lgn: string;
  lat: string;
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
    otp: { type: String },
    otp_expiry: { type: Date },
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
