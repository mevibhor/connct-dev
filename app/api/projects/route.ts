import { NextRequest, NextResponse } from "next/server";
import { mockProjects, delay } from "@/lib/mock-data";

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
