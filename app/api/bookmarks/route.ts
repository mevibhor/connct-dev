import { NextRequest, NextResponse } from "next/server";
import { bookmarkedProjectIds, toggleBookmark, delay } from "@/lib/mock-data";

// GET: Fetch all bookmarked project IDs for the current user
export async function GET() {
  await delay(300); // Fast response for UI feel
  return NextResponse.json({
    success: true,
    data: bookmarkedProjectIds,
  });
}

// POST: Toggle a bookmark
export async function POST(request: NextRequest) {
  await delay(500); // Simulate network latency

  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Toggle the bookmark in our mock database
    const updatedBookmarks = toggleBookmark(projectId);

    return NextResponse.json({
      success: true,
      data: updatedBookmarks,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to toggle bookmark" },
      { status: 500 },
    );
  }
}
