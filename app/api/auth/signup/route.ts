import { NextRequest, NextResponse } from "next/server";

import { readDatabase, writeDatabase, generateId } from "@/lib/db";

import { AuthResponse, User } from "@/types/models";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, profession, password } = body;

    if (!name || !email || !profession || !password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 6) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Password must be at least 6 characters",
        },
        {
          status: 400,
        },
      );
    }

    const db = await readDatabase();

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = db.users.find(
      (user) => user.email.toLowerCase() === normalizedEmail,
    );

    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "User with this email already exists",
        },
        {
          status: 409,
        },
      );
    }

    const newUser: User = {
      id: generateId("user"),
      name: name.trim(),
      email: normalizedEmail,
      profession: profession.trim(),
      techStack: [],
    };

    db.users.push(newUser);

    await writeDatabase(db);

    return NextResponse.json<AuthResponse>({
      success: true,
      user: newUser,
      token: `mock-token-${newUser.id}-${Date.now()}`,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: "Failed to create account",
      },
      {
        status: 500,
      },
    );
  }
}
