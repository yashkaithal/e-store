import { dbConnect } from "@/databaseConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs"
import { NextRequest } from "next/server"; 

dbConnect()

export async function POST(request :NextRequest) {
    try {
        const {token, password} = await request.json()

        const user = await User.findOne({forgotPasswordToken: token, forgotPasswordTokenExpiry: {$gt: Date.now()}})

        if(!user){
            return Response.json({error: "invalid token"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt()
        const hashedpassword = await bcryptjs.hash(password, salt)

        user.password=hashedpassword
        user.forgotPasswordToken=undefined
        user.forgotPasswordTokenExpiry=undefined
        await user.save()

        return Response.json({message: "password reset successfull", success: true}, {status: 200})

    } catch (error: any) {
        return Response.json({error: error.message}, {status: 500})
    }
}