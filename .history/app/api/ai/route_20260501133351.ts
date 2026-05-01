import { NextRequest } from "next/server";
import { parseResumeWithCVController } from "@/modules/ai/ai.controller";

export async function POST(req: NextRequest) {
    return parseResumeWithCVParseController(req)
    
}