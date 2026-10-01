import { NextRequest, NextResponse } from "next/server";
import { mockUsers, mockProjects, delay } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  await delay(600);

  const { userId } = await params;

  // Find the requested user
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "User not found",
      },
      { status: 404 },
    );
  }

  // Find all projects created by this user
  const userProjects = mockProjects
    .filter((project) => project.authorId === userId)
    .map((project) => ({
      ...project,
      author: user,
    }));

  return NextResponse.json({
    success: true,
    data: {
      user,
      projects: userProjects,
    },
  });
}
