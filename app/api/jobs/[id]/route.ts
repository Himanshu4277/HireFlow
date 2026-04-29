import {  findJobController } from "@/app/modules/jobs/jobs.controller";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    return findJobController(id);
}