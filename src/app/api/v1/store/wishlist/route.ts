import { dbConnect } from "@/databaseConfig/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Wishlist from "@/models/wishlistModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

// Reading wishlist (read) --- GET
export async function GET(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const wishlist = await Wishlist.findOne({user: loggedInUserId})

        return NextResponse.json({wishlist, success: true, message: "Wishlist return"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}

// adding to wishlist (create) --- POST
export async function POST(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const {item} = await request.json()

        let wishlist = await Wishlist.findOne({user: loggedInUserId})

        if(!wishlist) {
            wishlist = await Wishlist.create({user: loggedInUserId, items: []})
        }

        const itemFound = await wishlist.items.find( (existingItem: string) => existingItem == item )

        if(!itemFound) {
            wishlist.items=[...wishlist.items, item]
        wishlist.save()
        }

        return NextResponse.json({wishlist, success: true, message: "Item added to wishlist"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}

// Emptying wishlist --- PUT 
export async function PUT(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        let wishlist = await Wishlist.findOne({user: loggedInUserId})

        if(!wishlist) {
            return NextResponse.json({message: "wishlist not found", success: false}, {status: 500})
        }

        wishlist.items=[]
        wishlist.save()

        return NextResponse.json({wishlist, success: true, message: "Wishlist emptied"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}