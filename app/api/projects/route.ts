import { NextRequest, NextResponse } from "next/server";

import { readDatabase, writeDatabase, generateId } from "@/lib/db";

import { Project } from "@/types/models";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  try {
    const db = await readDatabase();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.toLowerCase() || "";

    const stage = searchParams.get("stage") || "";

    const page = Math.max(Number(searchParams.get("page") || "1"), 1);

    let filtered = db.projects;

    if (search) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(search) ||
          project.description.toLowerCase().includes(search) ||
          project.techStack.some((tech) => tech.toLowerCase().includes(search)),
      );
    }

    if (stage) {
      filtered = filtered.filter((project) => project.stage === stage);
    }

    const total = filtered.length;

    const start = (page - 1) * PAGE_SIZE;

    const end = start + PAGE_SIZE;

    const paginatedProjects = filtered.slice(start, end);

    const projectsWithAuthors = paginatedProjects.map((project) => ({
      ...project,
      author: db.users.find((user) => user.id === project.authorId),
    }));

    return NextResponse.json({
      success: true,
      data: projectsWithAuthors,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        hasMore: end < total,
      },
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await readDatabase();

    const body = await request.json();

    const { title, description, techStack, stage, authorId } = body;

    if (!title || !description || !techStack || !stage || !authorId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing fields",
        },
        { status: 400 },
      );
    }

    const authorExists = db.users.some((user) => user.id === authorId);

    if (!authorExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Author not found",
        },
        { status: 404 },
      );
    }

    const newProject: Project = {
      id: generateId("project"),
      authorId,
      title: title.trim(),
      description: description.trim(),
      techStack: techStack
        .split(",")
        .map((tech: string) => tech.trim())
        .filter(Boolean),
      stage,
      createdAt: new Date().toISOString(),
      bookmarkCount: 0,
    };

    db.projects.unshift(newProject);

    await writeDatabase(db);

    return NextResponse.json({
      success: true,
      data: {
        ...newProject,
        author: db.users.find((user) => user.id === authorId),
      },
    });
  } catch (error) {
    console.error("Create project error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const projectId = searchParams.get("projectId");

    const userId = searchParams.get("userId");

    if (!projectId || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Project ID and user ID are required",
        },
        { status: 400 },
      );
    }

    const db = await readDatabase();

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

    const project = db.projects[projectIndex];

    if (project.authorId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "You can only delete your own project",
        },
        { status: 403 },
      );
    }

    db.projects.splice(projectIndex, 1);

    db.bookmarks = db.bookmarks.filter(
      (bookmark) => bookmark.projectId !== projectId,
    );

    db.inquiries = db.inquiries.filter(
      (inquiry) => inquiry.projectId !== projectId,
    );

    await writeDatabase(db);

    return NextResponse.json({
      success: true,
      data: {
        projectId,
      },
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete project",
      },
      { status: 500 },
    );
  }
}
