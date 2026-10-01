import { NextRequest, NextResponse } from "next/server";

import { readDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const db = await readDatabase();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    const tech = searchParams.get("tech")?.trim().toLowerCase() || "";

    let developers = db.users;

    if (search) {
      developers = developers.filter((user) => {
        const nameMatch = user.name.toLowerCase().includes(search);

        const professionMatch = user.profession?.toLowerCase().includes(search);

        const bioMatch = user.bio?.toLowerCase().includes(search);

        const techStackMatch = user.techStack?.some((item) =>
          item.toLowerCase().includes(search),
        );

        return nameMatch || professionMatch || bioMatch || techStackMatch;
      });
    }

    if (tech) {
      developers = developers.filter((user) =>
        user.techStack?.some((item) => item.toLowerCase().includes(tech)),
      );
    }

    const data = developers.map((user) => ({
      ...user,

      projectCount: db.projects.filter(
        (project) => project.authorId === user.id,
      ).length,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get developers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch developers",
      },
      { status: 500 },
    );
  }
}
