import { dbConnect } from "@/databaseConfig/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

// Reading a product of specified id --- GET
// /api/v1/store/products/fje38023jf8fwe83rj49pe
export async function GET(request: NextRequest, {params}: {params: {id: String}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        const productId = params.id
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const product = await Product.findById(productId)

        if(!product) {
            return NextResponse.json({message: "Cannot find product", success: false}, {status: 400})
        }

        return NextResponse.json({product, success: true, message: "Product Found Successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

// Deleting a product of specified id --- DELETE
// /api/v1/store/products/fje38023jf8fwe83rj49pe
export async function DELETE(request: NextRequest, {params}: {params: {id: String}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        const productId = params.id
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const product = await Product.findByIdAndDelete(productId)

        return NextResponse.json({product, success: true, message: "Delete Successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

// Updating a product of specified id --- PUT
// /api/v1/store/products/fje38023jf8fwe83rj49pe
export async function PUT(request: NextRequest, {params}: {params: {id: String}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        const productId = params.id
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const {title, description, sku, price, category, brand, stock, images} = await request.json()

        const product = await Product.findByIdAndUpdate(productId, {title, description, sku, price, category, brand, stock, images, seller: loggedInUserId}, {new: true})

        if(!product) {
            return NextResponse.json({message: "Cannot update the product", success: false}, {status: 400})
        }

        return NextResponse.json({product, success: true, message: "Product Found Successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}