import express from "express";
import {
  CreateOrder,
  CustomerLogin,
  CustomerSignUp,
  GetAllOrders,
  GetCustomerProfile,
  GetOrderById,
  RequestOTP,
  UpdateCustomerProfile,
  VerifyCustomer,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post("/signup", CustomerSignUp);
router.post("/login", CustomerLogin);

router.use(Authenticate);

router.patch("/verify", VerifyCustomer);
router.get("/otp", RequestOTP);
router.get("/profile", GetCustomerProfile);
router.patch("/profile", UpdateCustomerProfile);

/************************************* Order *************************************/
router.post("/create-order", CreateOrder);
router.get("/orders", GetAllOrders);
router.get("/orders/:id", GetOrderById);

/************************************* Cart*************************************/

/************************************* Payments*************************************/

export { router as CustomerRoutes };
