import { findJobController } from "@/modules/jobs/jobs.controller";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }  ✅ params is Promise
) {
  try {
    const { id } = await context.params;  ✅ FIX HERE

    return findJobController(id);

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}