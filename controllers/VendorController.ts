import { Request, Response, NextFunction} from "express"
import { AddFoodInput, VendorLoginInput, VendorProfileInput, VendorServiceInput } from "../dto"
import { FindVendor } from "./AdminController"
import { generateSignature, validatePassword } from "../utility"
import { Food } from "../models"


export const VendorLogin = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const {email, password } = <VendorLoginInput>req.body
        const vendor = await FindVendor("", email)
        if(vendor !== null){
            const isValidPassword = await validatePassword(password, vendor.password, vendor.salt)
            if(isValidPassword){
               const signature = generateSignature({
                email: vendor.email,
                _id: vendor._id,
                name: vendor.name,
                phoneNumber: vendor.phoneNumber
               })
               return res.json(signature)
            }else{
                return res.status(400).json({message: "Invalid login credentials"}) 
            }
        }else{
            return res.status(400).json({message: "Invalid login credentials"})
        }
    } catch (error) {
        console.log("VENDOR_LOGIN_ERROR", error)
        return error
    }

}

export const GetVendorProfile = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if(user){
            const vendor = await FindVendor(user._id)
            return res.json(vendor)
        }

        return res.status(404).json({message: "Vendor profile not found"})

    } catch (error) {
        console.log("VENDOR_PROFILE_ERROR", error)
        return error
    }
}

export const UpdateVendorProfile = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const { foodType, name, ownerName, address, phoneNumber} = <VendorProfileInput>req.body
        const user = req.user
        if(user){
            const vendor = await FindVendor(user._id)

            if(vendor){
                vendor.name = name
                vendor.foodType = foodType
                vendor.ownerName = ownerName
                vendor.address = address
                vendor.phoneNumber = phoneNumber
                const savedResults =  await vendor?.save()
                return res.json(savedResults)
            }
            return res.json(vendor)

        }
        return res.status(404).json({message: "Vendor profile not found"})
    } catch (error) {
        console.log("UPDATE_VENDOR_ERROR", error)
        return error
    }
}

export const UpdateVendorImage = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if(user){
            const vendor = await FindVendor(user._id)

            if(vendor !== null){
                const files = req.files as [Express.Multer.File]
                const images = files.map((file: Express.Multer.File) => file.filename)
                vendor.coverImages.push(...images)
                const result = await vendor.save()
                return res.json(result)
            }

        }
        return res.status(404).json({message: "Vendor profile not found"})
    } catch (error) {
        console.log("UPDATE_VENDOR_IMAGE_ERROR", error)
        return error
    }
}

export const UpdateVendorService = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const { serviceAvailable } = <VendorServiceInput>req.body
        const user = req.user
        if(user){
            const vendor = await FindVendor(user._id)

            if(vendor){
                vendor.serviceAvailable = serviceAvailable
                const savedResults =  await vendor?.save()
                return res.json(savedResults)
            }
            return res.json(vendor)

        }
        return res.status(404).json({message: "Vendor profile not found"})
    } catch (error) {
        console.log("UPDATE_SERVICE_ERROR", error)
        return error
    }
}


export const AddFood = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, foodType, price, readyTime } = <AddFoodInput>req.body
        const user = req.user
        if(user){
            const vendor = await FindVendor(user._id)

            if(vendor !== null){
                const files = req.files as [Express.Multer.File]
                const images = files.map((file: Express.Multer.File) => file.filename)
                const food = await Food.create({
                    name,
                    description,
                    foodType,
                    price,
                    readyTime,
                    vendorId: vendor._id,
                    images
                })
                vendor.foods.push(food)
                const result = await vendor.save()
                return res.json(result)
            }

        }
        return res.status(404).json({message: "Vendor profile not found"})
    } catch (error) {
        console.log("ADD_FOOD_ERROR", error)
        return error
    }
}

export const GetFoods = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if(user){

                const foods = await Food.find({
                    vendorId: user._id
                })
                if(foods !== null){
                    return res.json(foods)
                }
            }

        return res.status(404).json({message: "Vendor foods not found"})
    } catch (error) {
        console.log("GET_FOODS_ERROR", error)
        return error
    }
}

export const GetFoodById = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const { serviceAvailable } = <VendorServiceInput>req.body
        const user = req.user
        if(user){
            const vendor = await FindVendor(user._id)

            if(vendor){
                vendor.serviceAvailable = serviceAvailable
                const savedResults =  await vendor?.save()
                return res.json(savedResults)
            }
            return res.json(vendor)

        }
        return res.status(404).json({message: "Vendor profile not found"})
    } catch (error) {
        console.log("UPDATE_SERVICE_ERROR", error)
        return error
    }
}