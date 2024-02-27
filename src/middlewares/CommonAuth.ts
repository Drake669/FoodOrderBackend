import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { validateSignature } from "../utility";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validate = await validateSignature(req);
    if (validate) {
      next();
      return;
    }

    return res.status(401).json({ message: "Unauthorized user" });
  } catch (error) {
    console.log("TOKEN_VALIDATION_ERROR", error);
    return error;
  }
};
