import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import {
    applyJob,
    getUserApplications,
    updateApplicationStatus
} from "@/app/modules/application/application.service"
import { getUserFromToken } from "@/app/utils/tokenVerify";

export async function applyJobController(req: NextRequest) {
    try {
        await dbConnect();

        const { jobId, resume } = await req.json();

        const user = getUserFromToken(req);
        const userId = user.id;

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!jobId) {
            return NextResponse.json(
                { message: "Job ID is required" },
                { status: 400 }
            );
        }

        const application = await applyJob(userId, jobId, resume);

        return NextResponse.json({
            message: "Applied successfully",
            data: application,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 400 }
        );
    }
}


export async function getUserApplicationscontroller(req: NextRequest) {
    try {
        await dbConnect();

        const user = getUserFromToken(req);
        const userId = user.id;

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const applications = await getUserApplications(userId);

        return NextResponse.json({ data: applications });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 400 }
        );
    }
}

export async function updateApplicationStatusController(req: NextRequest) {
    try {
        await dbConnect();

        const { appId, status } = await req.json();

        const user = getUserFromToken(req);
        const userId = user.id;

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!appId || !status) {
            return NextResponse.json(
                { message: "appId and status required" },
                { status: 400 }
            );
        }

        const updated = await updateApplicationStatus(
            appId,
            status,
            userId
        );

        return NextResponse.json({
            message: "Status updated",
            data: updated,
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}