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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  await delay(600);

  try {
    const { userId } = await params;
    const body = await request.json();

    const { name, profession, bio } = body;

    // Find the user
    const userIndex = mockUsers.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      );
    }

    // Basic validation
    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is required",
        },
        { status: 400 },
      );
    }

    if (!profession?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Profession is required",
        },
        { status: 400 },
      );
    }

    // Update the existing user
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      name: name.trim(),
      profession: profession.trim(),
      bio: bio?.trim() || "",
    };

    return NextResponse.json({
      success: true,
      data: mockUsers[userIndex],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: `oops! ${error}`,
      },
      { status: 500 },
    );
  }
}
