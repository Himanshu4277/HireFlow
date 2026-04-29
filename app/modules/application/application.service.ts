import dbConnect from "@/app/lib/db";
import Application from "@/app/models/Application";
import Job from "@/app/models/Job";

// ================= APPLY =================
export const applyJob = async (
  userId: string,
  jobId: string,
  resume?: string
) => {
  await dbConnect();

  const jobExists = await Job.findById(jobId);
  if (!jobExists) throw new Error("No job found");

  const alreadyApplied = await Application.findOne({
    user: userId,
    job: jobId,
  });

  if (alreadyApplied) {
    throw new Error("You already applied");
  }

  return await Application.create({
    user: userId,
    job: jobId,
    resume,
  });
};

// ================= USER APPLICATIONS =================
export const getUserApplications = async (userId: string) => {
  await dbConnect();

  return await Application.find({ user: userId })
    .populate("job")
    .sort({ createdAt: -1 });
};

// ================= RECRUITER APPLICATIONS =================
export const getApplicationsForRecruiter = async (recruiterId: string) => {
  await dbConnect();

  return await Application.find()
    .populate("user", "username email")
    .populate({
      path: "job",
      match: { postedBy: recruiterId },
    });
};

// ================= UPDATE STATUS =================
export const updateApplicationStatus = async (
  appId: string,
  status: "accepted" | "rejected",
  recruiterId: string
) => {
  await dbConnect();

  const application = await Application.findById(appId).populate("job");

  if (!application) throw new Error("Application not found");

  // @ts-ignore
  if (application.job.postedBy.toString() !== recruiterId) {
    throw new Error("Not authorized");
  }

  application.status = status;
  await application.save();

  return application;
};