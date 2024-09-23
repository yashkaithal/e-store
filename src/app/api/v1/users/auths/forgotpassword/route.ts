import User from "@/models/userModel";
import { dbConnect } from "@/databaseConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import { NextRequest } from "next/server";

dbConnect()

export async function POST(request: NextRequest) {
    try {
      const { email } = await request.json();
      const user = await User.findOne({ email });
      if (!user) {
        return Response.json({ error: "Email doesn't exist" }, { status: 400 });
      }

      await sendEmail({ email, emailType: "RESET", userId: user._id });

      return Response.json(
        {
          message: "password reset link sent to your email inbox",
          success: true,
        },
        { status: 200 }
      );
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
}