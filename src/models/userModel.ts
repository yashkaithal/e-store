import mongoose from "mongoose"


const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },

        lastname: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        phoneno: {
            type: String
        },

        address: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        }],

        isVerified: {
            type: Boolean,
            default: false
        },
    
    
        verifyToken: String,
    
        verifyTokenExpiry: Date,
    
        forgotPasswordToken: String,
    
        forgotPasswordTokenExpiry: Date,
    }, 
    {timestamps: true}
)

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User