import jwt from "jsonwebtoken";
import { APP_SECRET } from "../config";
import { AuthPayload } from "../dto/Auth.dto";
import { Request } from "express";

export const generateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "7d" });
};

export const validateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const token = signature.split(" ")[1];
    const payload = jwt.verify(token, APP_SECRET) as AuthPayload;
    req.user = payload;
    return true;
  }
  return false;
};
