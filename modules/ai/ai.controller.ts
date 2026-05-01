import { NextRequest, NextResponse } from "next/server";
import { parseResumeWithCVParse } from "./ai.service";

export async function parseResumeWithCVParseController(req: NextRequest) {

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const data = await parseResumeWithCVParse(file);

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (error:any) {
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }


}