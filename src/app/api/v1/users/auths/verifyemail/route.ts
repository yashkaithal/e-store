import User from "@/models/userModel";
import { dbConnect } from "@/databaseConfig/dbConfig";
import { NextRequest } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return Response.json({ error: "Invalid token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    
    return Response.json(
      {
        message: "Email verified successfully",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
