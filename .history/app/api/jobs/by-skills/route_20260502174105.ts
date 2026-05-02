
import { getJobsBySkillsController } from "@/modules/jobs/jobs.controller";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const { skills } = await req.json();

    const jobs = await getJobsBySkillsController(skills);

    return NextResponse.json({ success: true, jobs });
}