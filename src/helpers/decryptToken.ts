import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const decryptToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decodedToken.id;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to decrypt";
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
};
