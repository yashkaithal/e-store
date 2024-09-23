import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        unique: true
    }]
})

const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema)

export default Wishlist