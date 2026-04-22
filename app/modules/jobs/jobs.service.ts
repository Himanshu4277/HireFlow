import dbConnect from "@/app/lib/db"
import Job from "@/app/models/Job"

export async function createJob(data: any) {
    await dbConnect()

    const { title, company, description, salary, location, postedBy } = data

    if (!title || !company) {
        throw new Error("Title and Company are required")
    }

    return await Job.create({ title, company, description, salary, location, postedBy })
}

export async function findJob(id: string) {
    await dbConnect()

    const job = await Job.findById(id)

    if (!job) {
        throw new Error("Job not found")
    }

    return job
}

export async function getAllJobs() {
    await dbConnect()
    return await Job.find().sort({ createdAt: -1 })
}