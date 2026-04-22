import { NextResponse, NextRequest } from "next/server";
import { loginUser } from "@/app/modules/auth/auth.service";

export async function POST(req: NextRequest) {
    try {
        
        return loginUser(req)

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
        );
    }
}
