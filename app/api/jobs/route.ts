import { createJobController, findAllJobController } from "@/app/modules/jobs/jobs.controller";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    return createJobController(req);



}

export async function GET() {
    return findAllJobController();



}