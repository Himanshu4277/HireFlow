import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

export function verifyToken(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, secret) as { userId: string };
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
}