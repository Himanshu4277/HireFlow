import User from "@/app/models/User";
import dbConnect from "@/app/lib/db";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";

const secret = process.env.JWT_SECRET
if (!secret) {
    throw new Error("JWT_SECRET is not defined");
}



export async function createUser(req: Request) {

    try {
        await dbConnect()
        const { email, password, username, role } = await req.json()
        if (!email || !password || !username) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }


        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        const hashPassword = await bcrypt.hash(password, 10)

        const data = await User.create({
            role,
            username,
            email,
            password: hashPassword
        })

        const token = jwt.sign({ userId: data._id, role: data.role }, secret!, { expiresIn: "7d" })

        return NextResponse.json({
            message: "User created successfully",
            token,
            role: data.role,
            user: {
                id: data._id,
                username: data.username,
                email: data.email,
            },
        }, { status: 200 })
    } catch (error) {
        console.error("Create user error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );

    }



}

export async function loginUser(req: Request) {

    try {
        await dbConnect()
        const { email, password } = await req.json()

        if (!email || !password) {

            console.log("Credential Invalid");
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        }

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            secret!,
            { expiresIn: "7d" }
        );

        return NextResponse.json(
            {
                message: "Login successful",
                role: user.role,
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            },
            { status: 200 }
        );



    } catch (error) {
        console.error("Auth route error:", error);
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }




}

