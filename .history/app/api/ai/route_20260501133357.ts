import { NextRequest } from "next/server";
import { PDFParse } from "@/modules/ai/ai.controller";

export async function POST(req: NextRequest) {
    return parseResumeWithCVParseController(req)
    
}