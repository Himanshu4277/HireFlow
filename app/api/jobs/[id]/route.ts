import { findJobController } from "@/modules/jobs/jobs.controller";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await findJobController(params.id);

    return Response.json({ success: true, job });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}