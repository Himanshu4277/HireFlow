import { createJobController, findAllJobController } from "@/modules/jobs/jobs.controller";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    return createJobController(req);

}

export async function GET(req: Request) {
    return findAllJobController(req);

}