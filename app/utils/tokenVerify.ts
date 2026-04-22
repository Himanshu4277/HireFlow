import { NextRequest } from "next/server";
import Jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const getUserFromToken = (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        throw new Error("No token provided");
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = Jwt.verify(token, SECRET) as {
            id: string;
            email: string;
        };

        return decoded;
    } catch (err) {
        throw new Error("Invalid token");
    }
};