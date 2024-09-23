import { dbConnect } from "@/databaseConfig/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Address from "@/models/addressModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

// Reading all the addresses (read) --- GET
export async function GET(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const addresses = await Address.find({})

        return NextResponse.json({addresses, success: true, message: "Addresses listed successfully"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}

// adding an address (create) --- POST

export async function POST(request: NextRequest) {
    try {
        const loggedInUserId = await getIdFromToken(request)
        if(!loggedInUserId) {
            return NextResponse.json({error: "you are not logged in"}, 
                {status: 404})
        }

        const {street1, street2, landmark, city, state, postalCode, country} = await request.json()

        const address = await Address.create({street1, street2, landmark, city, state, postalCode, country})

        if(!address) {
            return NextResponse.json({error: "Address cannot be created", success: false}, {status: 400})
        }

        return NextResponse.json({address, success: true, message: "Addresses listed successfully"}, {status: 200}) 

    } catch (error: any) {
        return NextResponse.json({error:  error.message}, {status: 500})
    }
}