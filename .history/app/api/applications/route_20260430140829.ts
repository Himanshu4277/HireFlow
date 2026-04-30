import { updateApplicationStatusController, applyJobController, getUserApplicationscontroller } from "@/app/modules/application/application.controller";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        return applyJobController(req)
    } catch (error) {
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }

}
export async function GET(req: NextRequest) {
    try {
        return getUserApplicationscontroller(req)
    } catch (error) {
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
export async function PUT(req: NextRequest) {
    try {
        return updateApplicationStatusController(req)
    } catch (error) {
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }

}