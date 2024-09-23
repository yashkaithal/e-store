import { dbConnect } from "@/databaseConfig/dbConfig"
import { getIdFromToken } from "@/helpers/getIdFromToken"
import Wishlist from "@/models/wishlistModel"
import Product from "@/models/productModel"
import { NextRequest, NextResponse } from "next/server"

dbConnect()

// Remove an item from wishlist --- PATCH
export async function PATCH(request: NextRequest, {params}: {params: {id: string}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const wishlist = await Wishlist.findOne({user: loggedInUserId})

        if(!wishlist) {
            return NextResponse.json({message: "wishlist not found", success: false}, {status: 500})
        }

        wishlist.items = await wishlist.items.filter((item: string) => item != params.id)
        wishlist.save()

        return NextResponse.json({wishlist, success: true, message: "Removed from wislist"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}

// Read an item from wishlist --- GET
export async function GET(request: NextRequest, {params}: {params: {id: string}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const wishlist = await Wishlist.findOne({user: loggedInUserId})

        if(!wishlist) {
            return NextResponse.json({message: "wishlist not found", success: false}, {status: 500})
        }

        const itemId = await wishlist.items.find( (id: string) => id == params.id)

        const product = await Product.findById(itemId)

        return NextResponse.json({product, success: true, message: "Got the product"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}
