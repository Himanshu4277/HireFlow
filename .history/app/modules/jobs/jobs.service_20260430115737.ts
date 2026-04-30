import dbConnect from "@/app/lib/db"
import Job from "@/app/models/Job"

type JobType = {
    title: string;
    company: string;
    description: string;
    salary: number;
    location: string;
    postedBy?: string;
};

export async function createJob(data: JobType) {
    await dbConnect()

    const { title, company, description, salary, location, postedBy } = data

    if (!title || !company || !description) {
        throw new Error("Title ,description and Company are required")
    }

    return await Job.create({ title, company, description, salary, location, postedBy })
}

export async function findJob(id: string) {
    await dbConnect()
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid Job ID");
    }

    const job = await Job.findById(id)

    if (!job) {
        throw new Error("Job not found")
    }

    return job
}

export async function getAllJobs() {
    try {
        await dbConnect();
        const jobs = await Job.find().sort({ createdAt: -1 }).lean();

        return jobs;
    } catch (error: any) {
        throw new Error(error.message || "Error fetching jobs");
    }
}