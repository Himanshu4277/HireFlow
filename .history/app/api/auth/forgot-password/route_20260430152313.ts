import { forgotPasswordController } from "@/modules/auth/auth.controller";

export async function POST(req: Request) {
  return forgotPasswordController(req);
}