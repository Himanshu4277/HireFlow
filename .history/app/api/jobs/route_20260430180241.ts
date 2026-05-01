import { createJobController, findAllJobController } from "@/modules/jobs/jobs.controller";



export async function POST(req: Request) {
    return createJobController(req);

}

export async function GET(req: Request) {
    return findAllJobController(req);

}