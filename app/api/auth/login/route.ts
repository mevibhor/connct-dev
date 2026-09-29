import { NextRequest, NextResponse } from "next/server";
import { mockUsers, delay } from "@/lib/mock-data";
import { AuthResponse } from "@/types/models";

export async function POST(request: NextRequest) {
  // 1. Simulate network latency
  await delay(800);

  try {
    const body = await request.json();
    const { email, password } = body;

    // 2. Basic validation
    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    // 3. Find user in our "database"
    // For this mock, we accept any password as long as it's 6+ chars and the email exists
    const user = mockUsers.find((u) => u.email === email);

    if (user && password.length >= 6) {
      // 4. Success! Return user and a fake token
      return NextResponse.json<AuthResponse>({
        success: true,
        user,
        token: `mock-token-${user.id}-${Date.now()}`,
      });
    }

    // 5. Failure
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Invalid email or password" },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
