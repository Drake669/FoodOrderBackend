import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  CustomerSignUpInputs,
  CustomerLoginInputs,
  UpdateCustomerInputs,
} from "../dto/Customer.dto";
import { Customer } from "../models";
import {
  GenerateOTP,
  SendOTP,
  generateHashedPassword,
  generateSalt,
  generateSignature,
  validatePassword,
} from "../utility";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signupInputs = plainToClass(CustomerSignUpInputs, req.body);
    const inputErrors = await validate(signupInputs, {
      validationError: { target: false },
    });

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
      return res.status(201).json({ signature, verified: customer.verified });
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
) => {
  try {
    const loginInputs = plainToClass(CustomerLoginInputs, req.body);
    const inputErrors = await validate(loginInputs, {
      validationError: { target: false },
    });

    if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
    }
    const { email, password } = loginInputs;
    const customer = await Customer.findOne({ email });
    if (customer !== null) {
      const isValid = await validatePassword(
        password,
        customer.password,
        customer.salt
      );
      if (isValid) {
        const signature = generateSignature({
          _id: customer._id,
          email: customer.email,
          verified: customer.verified,
        });
        return res.status(200).json({ signature, verified: customer.verified });
      }
      return res.status(400).json({ message: "Invalid user password" });
    }
    return res.status(400).json({ message: "Email not found" });
  } catch (error) {
    console.log("CUSTOMER_LOGIN_ERROR");
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const RequestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = req.user;
    if (customer) {
      const profile = await Customer.findById(customer._id);
      if (profile !== null) {
        const { otp, expiry } = GenerateOTP();
        profile.otp = otp;
        profile.otp_expiry = expiry;
        const updatedProfile = await profile.save();
        await SendOTP(updatedProfile.otp, updatedProfile.phone_number);

        return res.status(200).json({ message: "OTP sent successfully" });
      }
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(401).json({ message: "Unauthorized user" });
  } catch (error) {
    console.log("REQUEST_OTP_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const VerifyCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;
        const updatedProfile = await profile.save();
        const signature = generateSignature({
          _id: updatedProfile._id,
          email: updatedProfile.email,
          verified: updatedProfile.verified,
        });
        return res
          .status(200)
          .json({ signature, verified: updatedProfile.verified });
      }
      return res.status(400).json({ message: "Error with OTP verification" });
    }
    return res.status(401).json({ message: "Unauthenticated user" });
  }
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = req.user;
    if (customer) {
      const profile = await Customer.findById(customer._id);
      if (profile !== null) {
        return res.status(200).json(profile);
      }
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(401).json({ message: "Unauthorized user" });
  } catch (error) {
    console.log("GET_CUSTOMER_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const UpdateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updateInputs = plainToClass(UpdateCustomerInputs, req.body);
    const inputErrors = await validate(updateInputs, {
      validationError: { target: false },
    });
    if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
    }
    const { first_name, last_name, address } = updateInputs;
    const customer = req.user;
    if (customer) {
      const profile = await Customer.findById(customer._id);
      if (profile !== null) {
        profile.first_name = first_name;
        profile.last_name = last_name;
        profile.address = address;
        const updatedProfile = await profile.save();
        return res.status(200).json(updatedProfile);
      }
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(401).json({ message: "Unauthorized user" });
  } catch (error) {
    console.log("UPDATE_CUSTOMER_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
