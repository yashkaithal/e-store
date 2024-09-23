import mongoose from "mongoose";
import Category from "./categoryModel";

const productSchema = new mongoose.Schema({
    images: {
        type: [String]
    },

    brand: {
        type: String,
    },

    stock: {
        type: Number,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
    },

    sku: {
        type: String
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }

}, {timestamps: true})

const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

export default Product