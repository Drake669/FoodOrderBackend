import express from "express";
import {
  CustomerLogin,
  CustomerSignUp,
  GetCustomerProfile,
  RequestOTP,
  UpdateCustomerProfile,
  VerifyCustomer,
} from "../controllers";

const router = express.Router();

router.post("/signup", CustomerSignUp);
router.post("/login", CustomerLogin);
router.patch("/verify", VerifyCustomer);
router.get("/otp", RequestOTP);
router.get("/profile", GetCustomerProfile);
router.patch("/profile", UpdateCustomerProfile);

export { router as CustomerRoutes };
