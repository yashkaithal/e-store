import { dbConnect } from "@/databaseConfig/dbConfig"
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"

dbConnect();

export async function POST(request: NextRequest) {
  let existingData = await request.json();
  // console.log(existingData);

  let { email, password } = existingData;

  //checking if user exist
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return NextResponse.json({ error: "User doesn't exist" });
  }

  //checking if password is correct
  const validPassword = await bcryptjs.compare(password, existingUser.password);

  if (!validPassword) {
    return NextResponse.json({ error: "invalid email or password" });
  }

  //creating token data
  const tokenData = {
    id: existingUser._id,
    email: existingUser.email,
  };

  //creating token
  const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({
    msg: "login successfully",
    success: true,
  });

  //adding token as cookies
   response.cookies.set("token", token, {
    httpOnly: true,
  });

  return response;
}
