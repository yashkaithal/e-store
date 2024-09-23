import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest){
    const path = request.nextUrl.pathname
    const isPublicPath = 
    path === "/" || 
    path === "/login" || 
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/forgotpassword" ||
    path === "/resetpassword"
    

    const token = request.cookies.get("token")?.value || ""

    if(!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl))
    }

    if((path === "/login" || path === "/signup") && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl))
    }
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/signup",
        "/verifyemail",
        "/forgotpassword",
        "/resetpassword",
        "/profile",
    ]
}