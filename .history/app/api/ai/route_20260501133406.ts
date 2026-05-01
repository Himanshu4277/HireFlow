import { NextRequest } from "next/server";
import { parseResumeWithOpenAiController } from "@/modules/ai/ai.controller";

export async function POST(req: NextRequest) {
    return parseResumeWithOpenAiController(req)
    
}