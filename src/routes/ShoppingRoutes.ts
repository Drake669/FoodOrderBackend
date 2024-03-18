import express from "express";
import {
  GetAvailableFoods,
  GetAvailableFoodsIn30Mins,
  GetResturantById,
  GetTopResturants,
  GetValidOffers,
  SearchFoods,
} from "../controllers";

const router = express.Router();

// Get Available Foods
router.get("/:pincode", GetAvailableFoods);

// Get Food Available in 30 Mins
router.get("/foods-in-30-mins/:pincode", GetAvailableFoodsIn30Mins);

// Get Top Resturants
router.get("/top-resturants/:pincode", GetTopResturants);

// Get Resturant by Id
router.get("/resturant/:id", GetResturantById);

// Search Foods
router.get("/search/:pincode", SearchFoods);

// Get available offers
router.get("/offers", GetValidOffers);

export { router as ShoppingRoutes };
