import { createJobController, findAllJobController } from "@/app/modules/jobs/jobs.controller";



export async function POST(req: Request) {
    return createJobController(req);

}

export async function GET() {
    return findAllJobController();

}