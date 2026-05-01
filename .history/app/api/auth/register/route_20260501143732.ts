import { NextResponse } from "next/server";
import { createUseCacheTracker } from "next/dist/build/webpack/plugins/telemetry-plugin/use-cache-tracker-utils";


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

