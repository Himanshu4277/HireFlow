import { createJob, findJob, getAllJobs } from "./jobs.service"
import { NextResponse } from "next/server"
import { verifyToken } from "@/app/lib/auth"


export async function createJobController(req: Request) {
    try {
        const user = verifyToken(req);
        const data = await req.json()
        const job = await createJob({
            ...data,
            postedBy: user.userId
        })

        return NextResponse.json({ success: true, data: job })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message })
    }
}

export async function findAllJobController() {
    try {
        const jobs = await getAllJobs()

        return NextResponse.json({ success: true, data: jobs })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message })
    }
}

export async function findJobController(id: string) {
    try {

        const job = await findJob(id)

        return NextResponse.json({ success: true, data: job })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message })
    }
}