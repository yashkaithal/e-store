import { dbConnect } from "@/databaseConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";

dbConnect()

export async function POST(request: Request) {
  try {
    let userData = await request.json();

  let { firstname, lastname, email, password, confirmpassword, phoneno } = userData;

  //checking if password matches
  if (password !== confirmpassword) {
    return NextResponse.json({ error: "password doesn't match" });
  }
  console.log(userData)

  const user = await User.findOne({ email });
  if (user) {
    return NextResponse.json({ error: "email already registered" });
  }

  // hashing
  const salt = await bcryptjs.genSalt();
  const hashedPassword = await bcryptjs.hash(password, salt);

  //create and save new user
  const newUser = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    phoneno,
  });

  // sending verification email 
  await sendEmail({email, emailType: "VERIFY", userId: newUser._id})
  
  return NextResponse.json({
    msg: "user created successfully",
    success: true,
    newUser,
  });

  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}