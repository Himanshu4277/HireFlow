import dbConnect from "@/lib/db";
import ContactForm from "@/models/contactForm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const data = await ContactForm.create(body);

    return NextResponse.json(
      { success: true, data, message: "Contact form submitted" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error.message);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}