import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

type DecodedToken = {
  userId: string;
  role: string;
};

export function verifyToken(req: Request): DecodedToken {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}