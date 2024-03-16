import { CustomerDocument, FoodDocument, VendorDocument } from "../models";

export interface AddOfferInputs {
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
  minValue: number;
}
