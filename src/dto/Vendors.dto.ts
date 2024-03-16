import { StringExpression } from "mongoose";

export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: string[];
  pincode: string;
  address: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface VendorLoginInput {
  email: string;
  password: string;
}
export interface VendorServiceInput {
  serviceAvailable: boolean;
}

export interface VendorProfileInput {
  name: string;
  ownerName: string;
  foodType: string[];
  address: string;
  phoneNumber: string;
}

export interface VendorPayload {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
}
