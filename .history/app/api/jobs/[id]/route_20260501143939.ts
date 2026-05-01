import {  findJobController } from "@/modules/jobs/jobs.controller F"

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    return findJobController(id);
}