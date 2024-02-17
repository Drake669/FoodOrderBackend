import express, {Request, Response, NextFunction} from "express"
import { AddFood, GetFoodById, GetFoods, GetVendorProfile, UpdateVendorImage, UpdateVendorProfile, UpdateVendorService, VendorLogin } from "../controllers"
import { Authenticate } from "../middlewares"
import multer from "multer"


const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '_' + file.originalname)
    }
  })

const images = multer({storage}).array("images", 10)
  

router.post("/login", VendorLogin)


router.use(Authenticate)
router.get("/profile", GetVendorProfile)
router.patch("/profile", UpdateVendorProfile)
router.patch("/coverImage", images,  UpdateVendorImage)
router.patch("/service", UpdateVendorService)

router.post("/food", images, AddFood)
router.get("/foods", GetFoods)
router.get("/food/:id", GetFoodById)


export { router as VendorRoutes}