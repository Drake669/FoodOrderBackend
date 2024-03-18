import express from "express";
import {
  AddFood,
  AddOffer,
  EditOffer,
  GetFoodById,
  GetFoods,
  GetOfferById,
  GetOffers,
  GetVendorOrderById,
  GetVendorOrders,
  GetVendorProfile,
  ProcessOrder,
  UpdateVendorImage,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from "../controllers";
import { Authenticate } from "../middlewares";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});

const images = multer({ storage }).array("images", 10);

router.post("/login", VendorLogin);

router.use(Authenticate);
router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/coverImage", images, UpdateVendorImage);
router.patch("/service", UpdateVendorService);

router.post("/food", images, AddFood);
router.get("/foods", GetFoods);
router.get("/food/:id", GetFoodById);

router.get("/orders", GetVendorOrders);
router.get("/orders/:id", GetVendorOrderById);
router.put("/orders/:id/process", ProcessOrder);

router.post("/offer", AddOffer);
router.get("/offers", GetOffers);
router.get("/offer/:id", GetOfferById);
router.patch("/offer/:id", EditOffer);

export { router as VendorRoutes };
