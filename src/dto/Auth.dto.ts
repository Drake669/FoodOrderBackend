import { VendorPayload } from "./Vendors.dto";
import { CustomerPayload } from "./Customer.dto";

export type AuthPayload = VendorPayload | CustomerPayload;
