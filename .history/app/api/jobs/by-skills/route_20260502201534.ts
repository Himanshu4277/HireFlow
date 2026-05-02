import { getJobsBySkillsController } from "@/modules/jobs/jobs.controller";
import { NextResponse } from "next/server";
getJobsBySkillsController

export async function POST(req: Request) {
    try {
        const { skills } = await req.json();

        if (!skills || !skills.length) {
            return NextResponse.json(
                { success: false, message: "No skills provided" },
                { status: 400 }
            );
        }

        const jobs = await getJobsBySkillsController(skills);

        return NextResponse.json({ success: true, jobs });

    } catch (error: any) {
        console.error("JOBS API ERROR:", error);

        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}