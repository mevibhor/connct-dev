import { NextRequest, NextResponse } from "next/server";

import { readDatabase, writeDatabase } from "@/lib/db";

interface RouteContext {
  params: Promise<{
    userId: string;
  }>;
}

const MIN_SKILLS = 5;
const MAX_SKILLS = 10;

export async function GET(_request: NextRequest, { params }: RouteContext) {
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

    const projects = db.projects
      .filter((project) => project.authorId === userId)
      .map((project) => ({
        ...project,
        author: user,
      }));

    return NextResponse.json({
      success: true,
      data: {
        user,
        projects,
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

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { userId } = await params;

    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";

    const profession =
      typeof body.profession === "string" ? body.profession.trim() : "";

    const rawTechStack: unknown[] = Array.isArray(body.techStack)
      ? body.techStack
      : [];

    const techStack = rawTechStack
      .filter((skill: unknown): skill is string => typeof skill === "string")
      .map((skill: string) => skill.trim())
      .filter(Boolean)
      .filter(
        (skill: string, index: number, skills: string[]) =>
          skills.findIndex(
            (item: string) => item.toLowerCase() === skill.toLowerCase(),
          ) === index,
      );

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is required",
        },
        { status: 400 },
      );
    }

    if (!profession) {
      return NextResponse.json(
        {
          success: false,
          error: "Profession is required",
        },
        { status: 400 },
      );
    }

    if (techStack.length < MIN_SKILLS) {
      return NextResponse.json(
        {
          success: false,
          error: `Please add at least ${MIN_SKILLS} skills`,
        },
        { status: 400 },
      );
    }

    if (techStack.length > MAX_SKILLS) {
      return NextResponse.json(
        {
          success: false,
          error: `You can add a maximum of ${MAX_SKILLS} skills`,
        },
        { status: 400 },
      );
    }

    const db = await readDatabase();

    const userIndex = db.users.findIndex((item) => item.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      );
    }

    db.users[userIndex] = {
      ...db.users[userIndex],
      name,
      profession,
      techStack,
    };

    await writeDatabase(db);

    return NextResponse.json({
      success: true,
      data: db.users[userIndex],
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
