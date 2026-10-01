import { NextRequest, NextResponse } from "next/server";
import { mockProjects, mockUsers, delay, Project } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  await delay(800); // Keep the delay so we can see the skeletons!

  // 1. Extract query parameters from the URL
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const stage = searchParams.get("stage") || "";

  // 2. Filter the mock data in memory
  let filtered = mockProjects;

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.techStack.some((tech) => tech.toLowerCase().includes(search)),
    );
  }

  if (stage) {
    filtered = filtered.filter((p) => p.stage === stage);
  }

  // 3. Attach the author information to each project
  const projectsWithAuthors = filtered.map((project) => ({
    ...project,
    author: mockUsers.find((user) => user.id === project.authorId),
  }));

  return NextResponse.json({
    success: true,
    data: projectsWithAuthors,
  });
}

// POST Function

export async function POST(request: NextRequest) {
  await delay(800);

  try {
    const body = await request.json();

    const { title, description, techStack, stage, authorId } = body;

    if (!title || !description || !techStack || !stage || !authorId) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 },
      );
    }

    const newProject: Project = {
      id: "p" + Date.now(),
      authorId,
      title,
      description,
      techStack: techStack.split(",").map((t: string) => t.trim()),
      stage: stage as "Idea" | "MVP" | "Production",
      createdAt: "Just now",
      bookmarkCount: 0,
    };

    mockProjects.unshift(newProject);

    return NextResponse.json({
      success: true,
      data: newProject,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `oops! ${error}` },
      { status: 500 },
    );
  }
}
