import { NextRequest, NextResponse } from "next/server";

import { readDatabase, writeDatabase } from "@/lib/db";

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

    const bookmarks = db.bookmarks.filter(
      (bookmark) => bookmark.userId === userId,
    );

    const bookmarkedIds = bookmarks.map((bookmark) => bookmark.projectId);

    const bookmarkedProjects = bookmarks
      .map((bookmark) => {
        const project = db.projects.find(
          (item) => item.id === bookmark.projectId,
        );

        if (!project) {
          return null;
        }

        return {
          ...project,
          author: db.users.find((user) => user.id === project.authorId),
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        ids: bookmarkedIds,
        projects: bookmarkedProjects,
      },
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bookmarks",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { userId, projectId } = body;

    if (!userId || !projectId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID and project ID are required",
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

    const projectIndex = db.projects.findIndex(
      (project) => project.id === projectId,
    );

    if (projectIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 },
      );
    }

    const bookmarkIndex = db.bookmarks.findIndex(
      (bookmark) =>
        bookmark.userId === userId && bookmark.projectId === projectId,
    );

    if (bookmarkIndex !== -1) {
      db.bookmarks.splice(bookmarkIndex, 1);

      db.projects[projectIndex].bookmarkCount = Math.max(
        0,
        db.projects[projectIndex].bookmarkCount - 1,
      );
    } else {
      db.bookmarks.push({
        userId,
        projectId,
        createdAt: new Date().toISOString(),
      });

      db.projects[projectIndex].bookmarkCount += 1;
    }

    await writeDatabase(db);

    const userBookmarks = db.bookmarks.filter(
      (bookmark) => bookmark.userId === userId,
    );

    const bookmarkedIds = userBookmarks.map((bookmark) => bookmark.projectId);

    const bookmarkedProjects = userBookmarks
      .map((bookmark) => {
        const project = db.projects.find(
          (item) => item.id === bookmark.projectId,
        );

        if (!project) {
          return null;
        }

        return {
          ...project,
          author: db.users.find((user) => user.id === project.authorId),
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        ids: bookmarkedIds,
        projects: bookmarkedProjects,
      },
    });
  } catch (error) {
    console.error("Update bookmark error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update bookmark",
      },
      { status: 500 },
    );
  }
}
