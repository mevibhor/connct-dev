import { NextRequest, NextResponse } from "next/server";
import { delay } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  await delay(800); // Simulate network delay

  try {
    const body = await request.json();
    const { projectId, pitch, availability, relevantTech } = body;

    if (!projectId || !pitch || !availability || !relevantTech) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 },
      );
    }

    // In a real app, we'd save this to a database. Here, we just accept it.
    console.log("Mock Backend received collaboration request:", body);

    return NextResponse.json({
      success: true,
      message: "Request sent successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
