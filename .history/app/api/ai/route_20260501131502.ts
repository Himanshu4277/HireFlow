import { NextRequest } from "next/server";
import { parseResumeWithCVParseController } from "@/modules/ai/ai.controller";

export async function POST(req: NextRequest) {
    return parseResumeWithCVParseController(req)
    
}