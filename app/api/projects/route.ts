import { NextRequest, NextResponse } from "next/server";
import { mockProjects, delay, Project } from "@/lib/mock-data";

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

  return NextResponse.json({
    success: true,
    data: filtered,
  });
}

// ✅ ADD THIS POST FUNCTION
export async function POST(request: NextRequest) {
  await delay(800); // Simulate network delay

  try {
    const body = await request.json();
    const { title, description, techStack, stage } = body;

    if (!title || !description || !techStack || !stage) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 },
      );
    }

    // Create a new mock project
    const newProject: Project = {
      id: "p" + Date.now(),
      authorId: "1", // Hardcoded to Robert Fox (our mock logged-in user)
      title,
      description,
      // Split the comma-separated string into an array
      techStack: techStack.split(",").map((t: string) => t.trim()),
      stage: stage as "Idea" | "MVP" | "Production",
      createdAt: "Just now",
      bookmarkCount: 0,
    };

    // Add to the TOP of the mock database
    mockProjects.unshift(newProject);

    return NextResponse.json({
      success: true,
      data: newProject,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 },
    );
  }
}
