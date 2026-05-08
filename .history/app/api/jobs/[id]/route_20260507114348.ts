import { findJobController } from "@/modules/jobs/jobs.controller";
import { NextResponse } from "next/server";

export async function GET(
  context: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } = await context.params;  

    return findJobController(id);

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}