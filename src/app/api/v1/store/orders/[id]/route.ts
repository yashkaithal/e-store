import { dbConnect } from "@/databaseConfig/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

// To cancel the order --- PATCH 
export async function PATCH(request: NextRequest, {params}: {params: {id: string}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({message: "You are not logged in"}, {status: 404})
        }

        const orderId = params.id

        const { user } = await Order.findById(orderId).select("user")

        if(loggedInUserId !== user._id.toString()) {
            return NextResponse.json({message: "Cannot cancel order"}, {status: 404})
        }

        const order = await Order.findByIdAndUpdate(orderId, {orderStatus: "CANCELLED"}, {new: true})
        return NextResponse.json({order, message: "Order Cancelled", success: true}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({eror: error.message}, {status: 500})
    }
}