import { forgotPasswordController } from "@/modules/auth/auth.service";

export async function POST(req: Request) {
  return forgotPasswordController(req);
}

export async function GET() {
  return Response.json({ message: "API working" });
}