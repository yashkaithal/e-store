import { dbConnect } from "@/databaseConfig/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

// Reading all the products (read) --- GET
export async function GET(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const products = await Product.find({})

        return NextResponse.json({products, success: true, message: "All products listed successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}

// adding a product (create) --- POST

export async function POST(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const {title, description, sku, price, category, brand, stock, images}
        = await request.json()

        const product = await Product.create({title, description, sku, price, category, brand, stock, images, seller: loggedInUserId})

        if(!product) {
            return NextResponse.json({error: "Product cannot be added", success: false}, {status: 400})
        }

        return NextResponse.json({product, success: true, message: "Product added successfully"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}