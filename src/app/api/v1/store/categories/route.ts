import { dbConnect } from "@/databaseConfig/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Category from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

// Reading all the categories (read) --- GET
export async function GET(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const categories = await Category.find({})

        return NextResponse.json({categories, success: true, message: "Categories listed successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}

// adding a category (create) --- POST

export async function POST(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const {name, description, parentCategory} = await request.json()

        const category = await Category.create({name, description, parentCategory})

        if(!category) {
            return NextResponse.json({error: "Category cannot be created", success: false}, {status: 400})
        }

        return NextResponse.json({category, success: true, message: "Categories created successfully"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}