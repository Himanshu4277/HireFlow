import { findJobController } from "@/app/modules/jobs/jobs.controller";

export async function GET(
    { params }: { params: { id: string } }
) {

    return findJobController(params.id)


}