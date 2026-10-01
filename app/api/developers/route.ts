import { NextRequest, NextResponse } from "next/server";

import { readDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const db = await readDatabase();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    const tech = searchParams.get("tech")?.trim().toLowerCase() || "";

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    const limit = 10;

    let developers = db.users;

    /*
     * Search by:
     * - Name
     * - Profession
     * - Tech stack
     */
    if (search) {
      developers = developers.filter((user) => {
        const nameMatch = user.name.toLowerCase().includes(search);

        const professionMatch = user.profession?.toLowerCase().includes(search);

        const techStackMatch = user.techStack?.some((skill) =>
          skill.toLowerCase().includes(search),
        );

        return nameMatch || professionMatch || techStackMatch;
      });
    }

    /*
     * Filter by technology
     */
    if (tech) {
      developers = developers.filter((user) =>
        user.techStack?.some((skill) => skill.toLowerCase().includes(tech)),
      );
    }

    /*
     * Calculate project counts once.
     */
    const projectCounts = new Map<string, number>();

    for (const project of db.projects) {
      const count = projectCounts.get(project.authorId) || 0;

      projectCounts.set(project.authorId, count + 1);
    }

    /*
     * Add project count for each developer.
     */
    const developersWithProjectCount = developers.map((user) => ({
      ...user,
      projectCount: projectCounts.get(user.id) || 0,
    }));

    /*
     * Pagination
     */
    const startIndex = (page - 1) * limit;

    const paginatedDevelopers = developersWithProjectCount.slice(
      startIndex,
      startIndex + limit,
    );

    const hasMore = startIndex + limit < developersWithProjectCount.length;

    return NextResponse.json({
      success: true,
      data: paginatedDevelopers,
      pagination: {
        page,
        limit,
        hasMore,
        total: developersWithProjectCount.length,
      },
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
