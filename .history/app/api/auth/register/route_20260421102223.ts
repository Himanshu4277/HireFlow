import { NextResponse } from "next/server";
import { createUser } from "@/app/modules/auth/auth.service";


export async function POST(req: Request) {
  try {
    return createUser(req)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

