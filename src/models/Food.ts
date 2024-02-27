import mongoose, {Schema, Document} from "mongoose";

export interface FoodDocument extends Document{
    vendorId: string;
    name: string;
    description?: string;
    foodType: string;
    price: number;
    readyTime: number;
    images: string[];
    rating: number;
} 

const FoodSchema = new Schema({
    name: {type: String, required: true},
    vendorId: {type: String, required: true},
    description: {type: String},
    foodType: {type: String},
    price: {type: Number, required: true},
    rating: {type: Number},
    images: {type: [String]},
    readyTime: {type: Number, required: true}
}, {
    timestamps : true,
    toJSON: {
        transform(doc, ret){
            delete ret.__v
        }
    }
})

const Food = mongoose.model<FoodDocument>("Food", FoodSchema)

export { Food }