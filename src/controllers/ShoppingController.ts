import { NextFunction, Request, Response } from "express";
import { FoodDocument, Vendor } from "../models";

export const GetAvailableFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincode = req.params.pincode;
    const results = await Vendor.find({ pincode, serviceAvailable: true })
      .sort([["rating", "desc"]])
      .populate("foods");

    return res.status(200).json(results);
  } catch (error) {
    console.log("GET_AVAILABLE_FOODS_ERROR", error);
    return error;
  }
};

export const GetAvailableFoodsIn30Mins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincode = req.params.pincode;
    const results = await Vendor.find({
      pincode,
      serviceAvailable: true,
    }).populate("foods");

    let foodResults: any[] = [];

    if (results.length > 0) {
      results.map((vendor) => {
        const foods = vendor.foods as [FoodDocument];
        const foodsLessThan30 = foods.filter((food) => food.readyTime <= 30);
        foodResults.push(foodsLessThan30);
      });
    }

    return res.status(200).json(foodResults);
  } catch (error) {
    console.log("GET_AVAILABLE_FOODS_ERROR", error);
    return error;
  }
};

export const GetResturantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const resturants = await Vendor.findById(id).populate("foods");
    if (resturants !== null) {
      return res.status(200).json(resturants);
    }
    return res.status(400).json({ message: "Resturant not found" });
  } catch (error) {
    console.log("GET_RESTURANT_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetTopResturants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincode = req.params.pincode;
    const results = await Vendor.find({ pincode, serviceAvailable: true })
      .sort([["rating", "desc"]])
      .limit(10);

    return res.status(200).json(results);
  } catch (error) {
    console.log("GET_TOP_RESTURANTS_ERROR", error);
    return error;
  }
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincode = req.params.pincode;
    const results = await Vendor.find({
      pincode,
      serviceAvailable: true,
    }).populate("foods");

    let foodResults: any[] = [];

    if (results.length > 0) {
      results.map((vendor) => {
        const foods = vendor.foods as [FoodDocument];
        foodResults.push(foods);
      });
    }

    return res.status(200).json(foodResults);
  } catch (error) {
    console.log("SEARCH_FOODS_ERROR", error);
    return error;
  }
};
