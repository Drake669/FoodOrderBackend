import express from "express";
import {
  AddToCart,
  CreateOrder,
  CreatePayment,
  CustomerLogin,
  CustomerSignUp,
  EmptyCart,
  GetAllOrders,
  GetCart,
  GetCustomerProfile,
  GetOrderById,
  RequestOTP,
  UpdateCustomerProfile,
  VerifyCustomer,
  VerifyOffer,
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
router.post("/cart", AddToCart);
router.get("/cart", GetCart);
router.delete("/cart", EmptyCart);

/************************************* Offer*************************************/
router.get("/offer/verify/:id", VerifyOffer);

/************************************* Payments*************************************/
router.post("/create-payment", CreatePayment);

export { router as CustomerRoutes };
