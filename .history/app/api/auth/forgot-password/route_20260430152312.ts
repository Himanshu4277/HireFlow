import { forgotPasswordControlle

export async function POST(req: Request) {
  return forgotPasswordController(req);
}