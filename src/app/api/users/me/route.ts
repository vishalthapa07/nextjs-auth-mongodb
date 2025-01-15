import { connect } from "@/dbConfig/dbConfig";
import { decryptToken } from "@/helpers/decryptToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  // extract data from token
  const userId = await decryptToken(request);

  //   we donot need pasword to pass
  const user = await User.findOne({ _id: userId }).select("-password");

  return NextResponse.json({
    message: "User found",
    data: user,
  });
}
