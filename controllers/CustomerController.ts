import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { CustomerSignUpInputs } from "../dto/Customer.dto";
import { Customer } from "../models";
import {
  GenerateOTP,
  SendOTP,
  generateHashedPassword,
  generateSalt,
  generateSignature,
} from "../utility";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signupInputs = plainToClass(CustomerSignUpInputs, req.body);
    const inputErrors = await validate(signupInputs);

    if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
    }

    const { email, password, phone_number } = signupInputs;
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const salt = await generateSalt();
    const hashedPassword = await generateHashedPassword(password, salt);

    const { otp, expiry } = GenerateOTP();

    const customer = await Customer.create({
      email,
      password: hashedPassword,
      phone_number,
      first_name: "",
      last_name: "",
      otp,
      otp_expiry: expiry,
      address: "",
      lgn: "",
      lat: "",
      verified: false,
      salt,
    });

    if (customer !== null) {
      //send otp
      await SendOTP(otp, phone_number);

      const signature = generateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });
      return res.status(201).json(signature);
    }
  } catch (error) {
    console.log("CUSTOMER_SIGNUP_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const VerifyCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const RequestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const UpdateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
