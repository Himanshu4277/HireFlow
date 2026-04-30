import { getRecruiterApplicationsController,updateApplicationStatusController } from "@/app/modules/application/application.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return getRecruiterApplicationsController(req);
}

export async function PUT(req: NextRequest) {
  return updateApplicationStatusController(req);
}