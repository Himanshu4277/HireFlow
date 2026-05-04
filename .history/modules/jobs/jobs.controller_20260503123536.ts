import { createJob, findJob, getAllJobs, fetchAndStoreJobsBySkills, getJobsFromDBBySkills } from "./jobs.service"
import { NextResponse, NextRequest } from "next/server"
import { getUserFromToken } from "@/utils/tokenVerify" // ✅ updated import


export async function createJobController(req: NextRequest) { // ✅ NextRequest
    try {
        let user;

        try {
            user = getUserFromToken(req); // ✅ updated
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

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

// rest of the file stays the same...