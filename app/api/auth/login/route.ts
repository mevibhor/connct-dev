import { NextRequest, NextResponse } from "next/server";

import { readDatabase } from "@/lib/db";
import { AuthResponse } from "@/types/models";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        {
          status: 400,
        },
      );
    }

    const db = await readDatabase();

    const normalizedEmail = email.trim().toLowerCase();

    const user = db.users.find(
      (item) => item.email.toLowerCase() === normalizedEmail,
    );

    if (!user || password.length < 6) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json<AuthResponse>({
      success: true,
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: "Failed to login",
      },
      {
        status: 500,
      },
    );
  }
}
