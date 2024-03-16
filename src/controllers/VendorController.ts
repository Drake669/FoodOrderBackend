import { Request, Response, NextFunction } from "express";
import {
  AddFoodInput,
  ProcessOrderInputs,
  VendorLoginInput,
  VendorProfileInput,
  VendorServiceInput,
  AddOfferInputs,
  CreateVendorInput,
} from "../dto";
import { FindVendor } from "./AdminController";
import { generateSignature, validatePassword } from "../utility";
import { Food, Offer, Order, Vendor } from "../models";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = <VendorLoginInput>req.body;
    const vendor = await FindVendor("", email);
    if (vendor !== null) {
      const isValidPassword = await validatePassword(
        password,
        vendor.password,
        vendor.salt
      );
      if (isValidPassword) {
        const signature = generateSignature({
          email: vendor.email,
          _id: vendor._id,
          name: vendor.name,
          phoneNumber: vendor.phoneNumber,
        });
        return res.json(signature);
      } else {
        return res.status(400).json({ message: "Invalid login credentials" });
      }
    } else {
      return res.status(400).json({ message: "Invalid login credentials" });
    }
  } catch (error) {
    console.log("VENDOR_LOGIN_ERROR", error);
    return error;
  }
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (user) {
      const vendor = await FindVendor(user._id);
      return res.json(vendor);
    }

    return res.status(404).json({ message: "Vendor profile not found" });
  } catch (error) {
    console.log("VENDOR_PROFILE_ERROR", error);
    return error;
  }
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { foodType, name, ownerName, address, phoneNumber } = <
      VendorProfileInput
    >req.body;
    const user = req.user;
    if (user) {
      const vendor = await FindVendor(user._id);

      if (vendor) {
        vendor.name = name;
        vendor.foodType = foodType;
        vendor.ownerName = ownerName;
        vendor.address = address;
        vendor.phoneNumber = phoneNumber;
        const savedResults = await vendor?.save();
        return res.json(savedResults);
      }
      return res.json(vendor);
    }
    return res.status(404).json({ message: "Vendor profile not found" });
  } catch (error) {
    console.log("UPDATE_VENDOR_ERROR", error);
    return error;
  }
};

export const UpdateVendorImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (user) {
      const vendor = await FindVendor(user._id);

      if (vendor !== null) {
        const files = req.files as [Express.Multer.File];
        const images = files.map((file: Express.Multer.File) => file.filename);
        vendor.coverImages.push(...images);
        const result = await vendor.save();
        return res.json(result);
      }
    }
    return res.status(404).json({ message: "Vendor profile not found" });
  } catch (error) {
    console.log("UPDATE_VENDOR_IMAGE_ERROR", error);
    return error;
  }
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serviceAvailable } = <VendorServiceInput>req.body;
    const user = req.user;
    if (user) {
      const vendor = await FindVendor(user._id);

      if (vendor) {
        vendor.serviceAvailable = serviceAvailable;
        const savedResults = await vendor?.save();
        return res.json(savedResults);
      }
      return res.json(vendor);
    }
    return res.status(404).json({ message: "Vendor profile not found" });
  } catch (error) {
    console.log("UPDATE_SERVICE_ERROR", error);
    return error;
  }
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, foodType, price, readyTime } = <AddFoodInput>(
      req.body
    );
    const user = req.user;
    if (user) {
      const vendor = await FindVendor(user._id);

      if (vendor !== null) {
        const files = req.files as [Express.Multer.File];
        const images = files.map((file: Express.Multer.File) => file.filename);
        const food = await Food.create({
          name,
          description,
          foodType,
          price,
          readyTime,
          vendorId: vendor._id,
          images,
        });
        vendor.foods.push(food);
        const result = await vendor.save();
        return res.json(result);
      }
    }
    return res.status(404).json({ message: "Vendor profile not found" });
  } catch (error) {
    console.log("ADD_FOOD_ERROR", error);
    return error;
  }
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (user) {
      const foods = await Food.find({
        vendorId: user._id,
      });
      if (foods !== null) {
        return res.json(foods);
      }
    }

    return res.status(404).json({ message: "Vendor foods not found" });
  } catch (error) {
    console.log("GET_FOODS_ERROR", error);
    return error;
  }
};

export const GetFoodById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serviceAvailable } = <VendorServiceInput>req.body;
    const user = req.user;
    if (user) {
      const vendor = await FindVendor(user._id);

      if (vendor) {
        vendor.serviceAvailable = serviceAvailable;
        const savedResults = await vendor?.save();
        return res.json(savedResults);
      }
      return res.json(vendor);
    }
    return res.status(404).json({ message: "Vendor profile not found" });
  } catch (error) {
    console.log("UPDATE_SERVICE_ERROR", error);
    return error;
  }
};

export const GetVendorOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = req.user;
    if (vendor) {
      const orders = await Order.find({ vendorId: vendor._id }).populate(
        "items.food"
      );
      if (orders) {
        return res.status(200).json(orders);
      }
      return res.status(400).json({ message: "Failed to get orders" });
    }
    return res.status(401).json({ message: "Unauthorized user" });
  } catch (error) {
    console.log("GET_ORDERS_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetVendorOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = req.user;
    if (vendor) {
      const orderId = req.params.id;
      const order = await Order.findById(orderId).populate("items.food");
      if (order) {
        return res.status(200).json(order);
      }
      return res.status(400).json({ message: "Failed to get order" });
    }
    return res.status(401).json({ message: "Unauthorized user" });
  } catch (error) {
    console.log("GET_ORDER_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = req.user;
    if (vendor) {
      const orderId = req.params.id;
      const {
        orderStatus,
        deliveryId,
        remarks,
        readyTime,
        appliedOffers,
        offerId,
      } = <ProcessOrderInputs>req.body;
      const order = await Order.findById(orderId).populate("items.food");
      if (order) {
        order.orderStatus = orderStatus;
        order.remarks = remarks;
        order.readyTime = readyTime;
        const processedOrder = await order.save();
        return res.status(200).json(processedOrder);
      }
      return res.status(400).json({ message: "Failed to process order" });
    }
    return res.status(401).json({ message: "Unauthorized user" });
  } catch (error) {
    console.log("PROCESS_ORDER_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const AddOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = req.user;
    if (vendor) {
      const {
        offerType,
        offerPercentage,
        offerName,
        isActive,
        startDate,
        endDate,
        promoCode,
        promoType,
        banks,
        bins,
        users,
        food,
        minValue,
      } = <AddOfferInputs>req.body;
      const profile = await Vendor.findById(vendor._id);
      if (profile !== null) {
        const offer = await Offer.create({
          offerType,
          offerPercentage,
          offerName,
          isActive,
          startDate,
          endDate,
          promoCode,
          promoType,
          banks,
          bins,
          users,
          food,
          vendors: [profile],
          minValue,
        });
        return res.status(201).json(offer);
      }
      return res.status(400).json({ message: "Vendor profile not found" });
    }
    return res.status(401).json({ message: "Unauthorized user" });
  } catch (error) {
    console.log("ADD_OFFER_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = req.user;
    if (vendor) {
      const vendorOffers = Array();
      const offers = await Offer.find().populate("vendors");
      offers.map((offer) => {
        if (offer.offerType === "GENERIC") {
          vendorOffers.push(offer);
        } else {
          offer.vendors.map((v) => {
            if (v._id.toString() === vendor._id) {
              vendorOffers.push(offer);
            }
          });
        }
      });
      if (offers) return res.status(200).json(vendorOffers);
      return res.status(400).json({ message: "Unable to get offers" });
    }
    return res.status(401).json({ message: "Unauthorized user" });
  } catch (error) {
    console.log("GET_OFFERS_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const EditOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = req.user;
    if (vendor) {
      const id = req.params.id;
      const offer = await Offer.findById(id).populate("vendors");
      if (offer !== null) {
        if (offer.vendors.some((v) => v._id === vendor._id)) {
          const {
            offerType,
            offerPercentage,
            offerName,
            isActive,
            startDate,
            endDate,
            promoCode,
            promoType,
            banks,
            bins,
            users,
            food,
            minValue,
          } = <AddOfferInputs>req.body;
          offer.offerType = offerType;
          offer.offerPercentage = offerPercentage;
          offer.offerName = offerName;
          offer.isActive = isActive;
          offer.startDate = startDate;
          offer.endDate = endDate;
          offer.promoCode = promoCode;
          offer.promoType = promoType;
          offer.banks = banks;
          offer.bins = bins;
          offer.users = users;
          offer.food = food;
          offer.minValue = minValue;

          const updatedOffer = await offer.save();
          return res.status(200).json(updatedOffer);
        }
      }
      return res.status(400).json({ message: "Failed to edit offer" });
    }
    return res.status(401).json({ message: "Unauthorized user" });
  } catch (error) {
    console.log("EDIT_OFFER_ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
