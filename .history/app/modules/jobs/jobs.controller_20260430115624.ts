import { createJob, findJob, getAllJobs } from "./jobs.service"
import { NextResponse } from "next/server"
import { verifyToken } from "@/app/lib/auth"


export async function createJobController(req: Request) {
    try {
        let user;

        try {
            user = verifyToken(req);
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
        try {
            verifyToken(req); // just check auth
        } catch {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

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

        return NextResponse.json({ success: true, data: job },{status:200})
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message },{status})
    }
}