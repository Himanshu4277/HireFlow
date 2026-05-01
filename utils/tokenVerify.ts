import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

type DecodedToken = {
  userId: string;
  role: string;
};

export function getUserFromToken(req: NextRequest): DecodedToken {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}