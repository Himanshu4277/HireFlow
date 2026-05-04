import { getUserFromToken } from "@/utils/tokenVerify";
import { createJob, findJob, getAllJobs, fetchAndStoreJobsBySkills, getJobsFromDBBySkills } from "./jobs.service"
import { NextResponse } from "next/server"



export async function createJobController(req: Request) {
    try {
        let user;

        try {
            user = get(req);
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // ✅ role check
        if (user.role !== "recruiter") {
            return NextResponse.json(
                { success: false, message: "Only recruiters can post jobs" },
                { status: 403 }
            );
        }

        const data = await req.json();

        const job = await createJob({
            ...data,
            postedBy: user.userId,
        });

        return NextResponse.json(
            { success: true, data: job },
            { status: 201 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function findAllJobController(req: Request) {
    try {
        const jobs = await getAllJobs();

        return NextResponse.json(
            { success: true, data: jobs },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function findJobController(id: string) {
    try {

        const job = await findJob(id)

        return NextResponse.json({ success: true, data: job }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 404 })
    }
}




export async function getJobsBySkillsController(skills: string[]) {
    try {
        const jobs = await fetchAndStoreJobsBySkills(skills);

        if (jobs.length) return jobs;

        return await getJobsFromDBBySkills(skills);
    } catch (error) {
        return await getJobsFromDBBySkills(skills);
    }
}