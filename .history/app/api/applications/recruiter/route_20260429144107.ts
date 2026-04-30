import { getRecruiterApplicationsController } from "@/app/modules/application/application.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return getRecruiterApplicationsController(req);
}