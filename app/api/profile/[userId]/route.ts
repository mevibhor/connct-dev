import { NextRequest, NextResponse } from "next/server";
import { mockUsers, mockProjects, delay } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  await delay(600); // Simulate network delay

  // In Next.js 15, params is a Promise, so we must await it
  const { userId } = await params;

  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 },
    );
  }

  // Find all projects created by this user
  const userProjects = mockProjects.filter((p) => p.authorId === userId);

  return NextResponse.json({
    success: true,
    data: {
      user,
      projects: userProjects,
    },
  });
}
