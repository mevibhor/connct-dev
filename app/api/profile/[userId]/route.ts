import { NextRequest, NextResponse } from "next/server";

import { readDatabase, writeDatabase } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    const db = await readDatabase();

    const user = db.users.find((item) => item.id === userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const userProjects = db.projects
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
  } catch (error) {
    console.error("Get profile error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load profile",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    const body = await request.json();

    const { name, profession, bio } = body;

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

    const db = await readDatabase();

    const userIndex = db.users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const updatedUser = {
      ...db.users[userIndex],
      name: name.trim(),
      profession: profession.trim(),
      bio: bio?.trim() || "",
    };

    db.users[userIndex] = updatedUser;

    await writeDatabase(db);

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile",
      },
      { status: 500 },
    );
  }
}
