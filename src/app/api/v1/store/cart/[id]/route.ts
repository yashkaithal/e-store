import { dbConnect } from "@/databaseConfig/dbConfig"
import { getIdFromToken } from "@/helpers/getIdFromToken"
import Product from "@/models/productModel"
import { NextRequest, NextResponse } from "next/server"
import Cart from "@/models/cartModel"

dbConnect()

// Remove an item from cart --- PATCH
export async function PATCH(request: NextRequest, {params}: {params: {id: string}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const cart = await Cart.findOne({user: loggedInUserId})

        if(!cart) {
            return NextResponse.json({message: "cart not found", success: false}, {status: 500})
        }

        cart.items = await cart.items.filter(({product}: {product: string}) => product != params.id)
        cart.save()

        return NextResponse.json({cart, success: true, message: "Removed from cart"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}

// Read an item from cart --- GET
export async function GET(request: NextRequest, {params}: {params: {id: string}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const cart = await Cart.findOne({user: loggedInUserId})

        if(!cart) {
            return NextResponse.json({message: "cart not found", success: false}, {status: 500})
        }

        const itemId = await cart.items.find( (id: string) => id == params.id)

        const product = await Product.findById(itemId)

        return NextResponse.json({product, success: true, message: "Got the product"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}