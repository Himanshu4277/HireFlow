import { resend } from "@/app/lib/resend";
import { generateResetToken } from "@/app/utils/generateResetToken";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ================= FORGOT PASSWORD =================
export async function forgotPasswordController(req: Request) {
  try {
    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const token = generateResetToken(user._id.toString());

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
      `,
    });

    return Response.json({ message: "Reset email sent" });
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}

// ================= RESET PASSWORD =================
export async function resetPasswordController(req: Request) {
  try {
    const { token, password } = await req.json();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.userId, {
      password: hashed,
    });

    return Response.json({ message: "Password updated" });
  } catch (err: any) {
    return Response.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }
}