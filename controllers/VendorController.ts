import { Request, Response, NextFunction} from "express"
import { VendorLoginInput } from "../dto"
import { FindVendor } from "./AdminController"
import { generateSignature, validatePassword } from "../utility"


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
                name: vendor.name
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