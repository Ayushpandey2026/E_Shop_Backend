
import mongoose from "mongoose";

let Schema  = mongoose.Schema;
let productSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    image:{
        type:String,
        required: true
    },
    rating: {
        rate: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    }
})

let productModel = mongoose.model("Product", productSchema);
export default productModel;