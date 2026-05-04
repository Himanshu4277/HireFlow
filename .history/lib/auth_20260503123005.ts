import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;


type DecodedToken = {
  userId: string;
  role: string;
};


export function generateResetToken(userId: string) {
  return jwt.sign({ userId }, secret, {
    expiresIn: "15m",
  });
}

