import { NextResponse } from "next/server";

export function GET() {
    try {
        const res = NextResponse.json({message: "logout successfully", success: true}, {status: 200})

        res.cookies.set("token", "", {httpOnly: true, expires: new Date(0)})

        return res

    } catch (error: any) {
        return Response.json({error: error.message}, {status: 500})
    }
}