import dbConnect from "@/app/lib/db";
import Application from "@/app/models/Application";
import Job from "@/app/models/Job";


export const applyJob = async (
    userId: string,
    jobId: string,
    resume?: string
) => {

    try {
        await dbConnect()

        const jobExists = await Job.findById(jobId)
        if (!jobExists) {
            throw new Error("NO Job Found")
        }

        const alreadyApplied = await Application.findOne({ user: userId, job: jobId })
        if (alreadyApplied) {
            throw new Error("You already applied to this job");
        }
        const apply = await Application.create({
            user: userId,
            job: jobId,
            resume,
        })

        return apply
    } catch (error: any) {
        if (error.code === 11000) {
            throw new Error("You already applied to this job");
        }
        throw new Error(error.message)
    }
}


export const getUserApplications = async (userId: string) => {
    await dbConnect()
    return await Application.find({ user: userId })
        .populate("job")
        .sort({ createdAt: -1 });
};


export const updateApplicationStatus = async (
    appId: string,
    status: "accepted" | "rejected",
    currentUserId: string
) => {
    await dbConnect();

    const application = await Application.findById(appId).populate("job");
    if (!application) throw new Error("Application not found");

    // check if current user is job owner
    // @ts-ignore
    if (application.job.postedBy.toString() !== currentUserId) {
        throw new Error("Not authorized");
    }

    application.status = status;
    await application.save();

    return application;
};