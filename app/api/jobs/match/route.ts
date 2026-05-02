import { getJobsBySkillsController } from "@/modules/jobs/jobs.controller";

export async function POST(req: Request) {
  try {
    const { skills } = await req.json();

    if (!skills || !skills.length) {
      return Response.json(
        { success: false, message: "Skills are required", jobs: [] },

        { status: 400 }
      );
    }

    const jobs = await getJobsBySkillsController(skills);

    return Response.json({ success: true, jobs });

  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}