import dbConnect from "@/lib/db";
import Job from "@/models/Job"
import mongoose from "mongoose";

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

export async function fetchAndStoreJobsBySkills(skills: string[]) {
    await dbConnect();

    const query = skills.join(" ");

    const res = await fetch(
        `https:jsearch.p.rapidapi.com/search?query=${query}&num_pages=1`,
        {
            headers: {
                "X-RapidAPI-Key": process.env.RAPID_API_KEY!,
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
            },
        }
    );

    const data = await res.json();
    console.log("RAPID API RESPONSE:", data);

    if (!data || !data.data || !Array.isArray(data.data)) {
        console.error("Invalid RapidAPI response");
        return [];
    }

    const jobs = data.data.map((job: any) => ({
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city,
        description: job.job_description,
        apply: job.job_apply_link,
        salary: 0,
    }));

    try {
        await Job.insertMany(jobs, { ordered: false });
    } catch (err) {
        console.log(err);

    }

    return jobs;
}


export async function getJobsFromDBBySkills(skills: string[]) {
    await dbConnect();

    const regex = new RegExp(skills.join("|"), "i");

    return await Job.find({
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
        ],
    }).limit(10);
}