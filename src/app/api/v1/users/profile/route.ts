import { dbConnect } from "@/databaseConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest } from "next/server";
import { getIdFromToken } from "@/helpers/getIdFromToken";

dbConnect()

export async function GET(request: NextRequest) {
    try {
        const userId = getIdFromToken(request)
        const user = await User.findOne({_id: userId}).select("firstname")

        return Response.json({message: "USer found", success: true, user}, {status: 200})
    } catch (error: any) {
        return Response.json({error: error.message}, {status: 500})
    }
}