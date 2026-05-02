import { NextRequest } from "next/server";
import { parseResumeController } from "@/modules/ai/ai.controller";

export async function POST(req: NextRequest) {
    return parseResumeController(req)
    
}