import { NextRequest } from "next/server";
import { parseResumeWithCVControlle } from "@/modules/ai/ai.controller";

export async function POST(req: NextRequest) {
    return parseResumeWithCVParseController(req)
    
}