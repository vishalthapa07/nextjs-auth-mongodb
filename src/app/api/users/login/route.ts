import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log(reqBody);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          error: "User does not exists",
        },
        {
          status: 400,
        }
      );
    }

    console.log("user exists: ", user);

    // compare user entered password with database saved password
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        {
          error: "Please check your credentials",
        },
        {
          status: 400,
        }
      );
    }

    // creating token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    jwt.sign();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to login";
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
