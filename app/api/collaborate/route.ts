import { NextRequest, NextResponse } from "next/server";

import { readDatabase, writeDatabase, generateId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 },
      );
    }

    const db = await readDatabase();

    const inquiryProjectIds = db.inquiries
      .filter((inquiry) => inquiry.userId === userId)
      .map((inquiry) => inquiry.projectId);

    return NextResponse.json({
      success: true,
      data: inquiryProjectIds,
    });
  } catch (error) {
    console.error("Get inquiry status error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch inquiry status",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { userId, projectId, pitch, availability, relevantTech } = body;

    if (!userId || !projectId || !pitch || !availability || !relevantTech) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      );
    }

    const db = await readDatabase();

    const userExists = db.users.some((user) => user.id === userId);

    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const project = db.projects.find((item) => item.id === projectId);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 },
      );
    }

    if (project.authorId === userId) {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot inquire about your own project",
        },
        { status: 403 },
      );
    }

    const existingInquiry = db.inquiries.find(
      (inquiry) => inquiry.userId === userId && inquiry.projectId === projectId,
    );

    if (existingInquiry) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already inquired about this project",
        },
        { status: 409 },
      );
    }

    const inquiry = {
      id: generateId("inquiry"),
      userId,
      projectId,
      pitch: pitch.trim(),
      availability,
      relevantTech: relevantTech.trim(),
      createdAt: new Date().toISOString(),
    };

    db.inquiries.push(inquiry);

    const existingBookmark = db.bookmarks.find(
      (bookmark) =>
        bookmark.userId === userId && bookmark.projectId === projectId,
    );

    if (!existingBookmark) {
      db.bookmarks.push({
        userId,
        projectId,
        createdAt: new Date().toISOString(),
      });

      const projectIndex = db.projects.findIndex(
        (item) => item.id === projectId,
      );

      if (projectIndex !== -1) {
        db.projects[projectIndex].bookmarkCount += 1;
      }
    }

    await writeDatabase(db);

    return NextResponse.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error("Collaboration request error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send collaboration request",
      },
      { status: 500 },
    );
  }
}
