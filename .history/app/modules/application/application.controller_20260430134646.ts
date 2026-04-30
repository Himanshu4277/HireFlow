import { NextRequest, NextResponse } from "next/server";
import {
  applyJob,
  getUserApplications,
  updateApplicationStatus,
  getApplicationsForRecruiter,
} from "@/app/modules/application/application.service";
import { verifyToken } from "@/app/lib/auth";
import dbConnect from "@/app/lib/db";
getUserFromToken 

// ================= APPLY =================
export async function applyJobController(req: NextRequest) {
  try {
    const { jobId, resume } = await req.json();
    const user = verifyToken(req);

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
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// ================= USER APPLICATIONS =================
export async function getUserApplicationscontroller(req: NextRequest) {
  try {
    const user = verifyToken(req);

    const applications = await getUserApplications(user.userId);

    return NextResponse.json({ data: applications });
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}

// ================= RECRUITER VIEW =================
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
// ================= UPDATE STATUS =================
export async function updateApplicationStatusController(req: NextRequest) {
  try {
    const { appId, status } = await req.json();
    const user = verifyToken(req);

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