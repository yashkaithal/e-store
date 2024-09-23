import { dbConnect } from "@/databaseConfig/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Category from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

// Reading a category of specified id --- GET
// /api/v1/store/categories/fje38023jf8fwe83rj49pe
export async function GET(request: NextRequest, {params}: {params: {id: String}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        const categoryId = params.id
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const category = await Category.findById(categoryId)

        if(!category) {
            return NextResponse.json({message: "Cannot find category", success: false}, {status: 400})
        }

        return NextResponse.json({category, success: true, message: "category Found Successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

// Deleting a category of specified id --- DELETE
// /api/v1/store/categories/fje38023jf8fwe83rj49pe
export async function DELETE(request: NextRequest, {params}: {params: {id: String}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        const categoryId = params.id
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const category = await Category.findByIdAndDelete(categoryId)

        return NextResponse.json({category, success: true, message: "Delete Successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

// Updating a category of specified id --- PUT
// /api/v1/store/categories/fje38023jf8fwe83rj49pe
export async function PUT(request: NextRequest, {params}: {params: {id: String}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        const categoryId = params.id
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const {name, description, parentCategory} = await request.json()

        const category = await Category.findByIdAndUpdate(categoryId, {name, description, parentCategory}, {new: true})

        if(!category) {
            return NextResponse.json({message: "Cannot update category", success: false}, {status: 400})
        }

        return NextResponse.json({category, success: true, message: "Category Found Successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}