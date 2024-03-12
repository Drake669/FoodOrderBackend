import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { generateHashedPassword, generateSalt } from "../utility";

export const FindVendor = async (
  id: string | undefined,
  email?: string,
  phoneNumber?: string
) => {
  if (email) {
    return await Vendor.findOne({ email });
  } else if (phoneNumber) {
    return await Vendor.findOne({ phoneNumber });
  } else {
    return await Vendor.findById(id);
  }
};

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      ownerName,
      foodType,
      address,
      pincode,
      email,
      password,
      phoneNumber,
    } = <CreateVendorInput>req.body;
    const existingEmail = await FindVendor("", email);
    const existingPhoneNumber = await FindVendor("", "", phoneNumber);

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "A vendor with this email already exist" });
    }

    if (existingPhoneNumber) {
      return res
        .status(400)
        .json({ message: "A vendor with this phone number already exist" });
    }

    const salt = await generateSalt();
    const hashedPassword = await generateHashedPassword(password, salt);
    const createdVendor = await Vendor.create({
      name,
      ownerName,
      foodType,
      address,
      pincode,
      email,
      password: hashedPassword,
      phoneNumber,
      salt,
    });

    return res.json(createdVendor);
  } catch (error) {
    console.log("VENDOR_CREATION_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendors = await Vendor.find();
    return res.json(vendors);
  } catch (error) {
    console.log("GET_VENDORS_ERROR", error);
    return error;
  }
};

export const GetVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = await FindVendor(req.params.id);
    return res.json(vendor);
  } catch (error) {
    console.log("GET_VENDOR_ERROR", error);
    return error;
  }
};
