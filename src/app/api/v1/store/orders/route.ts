import { dbConnect } from "@/databaseConfig/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";


dbConnect()

// List all orders --- GET
export async function GET(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({message: "You are not logged in"}, {status: 404})
        }

        const orders = await Order.find({})
        return NextResponse.json({orders, message: "Order listed", success: true}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

// Place/Create an order --- POST
export async function POST(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({message: "You are not logged in"}, {status: 404})
        }

        const {items, shippingAddress, paymentDetails} = await request.json()

        const order = await Order.create({items, shippingAddress, paymentDetails, user: loggedInUserId, orderStatus: "PLACED"})

        return NextResponse.json({order, message: "Order placed", success: true}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}