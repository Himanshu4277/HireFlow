import { NextRequest, NextResponse } from "next/server";
import {
  applyJob,
  getUserApplications,
  updateApplicationStatus,
  getApplicationsForRecruiter,
} from "@/modules/application/application.service";
import dbConnect from "@/lib/db";
import { getUserFromToken } from "@/utils/tokenVerify";

 ================= APPLY =================
export async function applyJobController(req: NextRequest) {
  try {
    const { jobId, resume } = await req.json();
    const user = getUserFromToken(req);

    if (!user.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "recruiter") {
      return NextResponse.json(
        { message: "Recruiters can't apply" },
        { status: 403 }
      );
    }

    const application = await applyJob(user.userId, jobId, resume);

    return NextResponse.json({
      message: "Applied successfully",
      data: application,
    });
  } catch (error: any) {
    const isConflict = error.message === "You already applied";
    return NextResponse.json({ message: error.message }, { status: isConflict ? 409 : 400 });
  }
}

 
export async function getUserApplicationscontroller(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    const applications = await getUserApplications(user.userId);

    if (jobId) {
       ✅ return single application for this job
      const found = applications.find(
        (app: any) => app.job._id.toString() === jobId
      );
      return NextResponse.json({ data: found || null });
    }

    return NextResponse.json({ data: applications });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
 ================= RECRUITER VIEW =================
export async function getRecruiterApplicationsController(req: NextRequest) {
  try {
    await dbConnect();

    const user = getUserFromToken(req);

    if (user.role !== "recruiter") {
      return NextResponse.json(
        { message: "Only recruiters allowed" },
        { status: 403 }
      );
    }

    const apps = await getApplicationsForRecruiter(user.userId);

    return NextResponse.json({
      success: true,
      data: apps,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
 ================= UPDATE STATUS =================
export async function updateApplicationStatusController(req: NextRequest) {
  try {
    const { appId, status } = await req.json();
    const user = getUserFromToken(req);

    if (user.role !== "recruiter") {
      return NextResponse.json(
        { message: "Only recruiters allowed" },
        { status: 403 }
      );
    }

    const updated = await updateApplicationStatus(
      appId,
      status,
      user.userId
    );

    return NextResponse.json({
      message: "Updated",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}