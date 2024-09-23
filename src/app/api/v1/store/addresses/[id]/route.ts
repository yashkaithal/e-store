import { dbConnect } from "@/databaseConfig/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Address from "@/models/addressModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

// Reading a address of specified id --- GET
// /api/v1/store/addresses/fje38023jf8fwe83rj49pe
export async function GET(request: NextRequest, {params}: {params: {id: String}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        const addressId = params.id
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const address = await Address.findById(addressId)

        if(!address) {
            return NextResponse.json({message: "Cannot find Address", success: false}, {status: 400})
        }

        return NextResponse.json({address, success: true, message: "Address Found Successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

// Deleting a address of specified id --- DELETE
// /api/v1/store/addresses/fje38023jf8fwe83rj49pe
export async function DELETE(request: NextRequest, {params}: {params: {id: String}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        const addressId = params.id
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const address = await Address.findByIdAndDelete(addressId)

        return NextResponse.json({address, success: true, message: "Delete Successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

// Updating a address of specified id --- PUT
// /api/v1/store/addresses/fje38023jf8fwe83rj49pe
export async function PUT(request: NextRequest, {params}: {params: {id: String}}) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        const addressId = params.id
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const {street1, street2, landmark, city, state, postalCode, country} = await request.json()

        const address = await Address.findByIdAndUpdate(addressId, {street1, street2, landmark, city, state, postalCode, country}, {new: true})

        if(!address) {
            return NextResponse.json({message: "Cannot update address", success: false}, {status: 400})
        }

        return NextResponse.json({address, success: true, message: "Address Found Successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}