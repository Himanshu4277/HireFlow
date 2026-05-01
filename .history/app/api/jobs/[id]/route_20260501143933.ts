import {  findJobController } from "@/"

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    return findJobController(id);
}