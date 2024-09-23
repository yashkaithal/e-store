import { dbConnect } from "@/databaseConfig/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Cart from "@/models/cartModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

// Reading cart (read) --- GET
export async function GET(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const cart = await Cart.findOne({user: loggedInUserId})

        return NextResponse.json({cart, success: true, message: "Cart found"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}

// adding to cart (create) --- POST
export async function POST(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const {item} = await request.json()

        let cart = await Cart.findOne({user: loggedInUserId})

        if(!cart) {
            cart = await Cart.create({user: loggedInUserId, items: []})
        }

        cart.items=[...cart.items, item]
        cart.save()

        return NextResponse.json({cart, success: true, message: "Item added to cart"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}

// Emptying cart --- PUT 
export async function PUT(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        let cart = await Cart.findOne({user: loggedInUserId})

        if(!cart) {
            return NextResponse.json({message: "cart not found", success: false}, {status: 500})
        }

        cart.items=[]
        cart.save()

        return NextResponse.json({cart, success: true, message: "cart emptied"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}
