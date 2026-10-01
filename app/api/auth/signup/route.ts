import { NextRequest, NextResponse } from "next/server";
import { mockUsers, delay } from "@/lib/mock-data";
import { AuthResponse, User } from "@/types/models";

export async function POST(request: NextRequest) {
  await delay(800);

  try {
    const body = await request.json();
    const { name, email, profession, password } = body;

    if (!name || !email || !profession || !password) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    const existingUser = mockUsers.find((u) => u.email === email);

    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "User with this email already exists" },
        { status: 409 },
      );
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      profession,
      bio: "",
      techStack: [],
    };

    mockUsers.push(newUser);

    return NextResponse.json<AuthResponse>({
      success: true,
      user: newUser,
      token: `mock-token-${newUser.id}-${Date.now()}`,
    });
  } catch (error) {
    return NextResponse.json<AuthResponse>(
      { success: false, error: `oops! ${error}` },
      { status: 500 },
    );
  }
}
