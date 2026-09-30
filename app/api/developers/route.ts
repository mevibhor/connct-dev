import { NextRequest, NextResponse } from "next/server";
import { mockUsers, delay } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  await delay(500);

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const tech = searchParams.get("tech") || "";

  let filtered = mockUsers;

  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.profession?.toLowerCase().includes(search),
    );
  }

  if (tech) {
    filtered = filtered.filter((u) =>
      u.techStack?.some((t) => t.toLowerCase() === tech.toLowerCase()),
    );
  }

  return NextResponse.json({ success: true, data: filtered });
}
