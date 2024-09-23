import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            red: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            default: 1
        },
    }],

    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },

    paymentDetails: {
        paymentMethod: {
            type: String,
            required: true
        },

        cardNumber: {
            type: String
        }
    },

    orderStatus: {
        type: String
    },

    trackingNumber: {
        type: String
    }
})

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)

export default Order