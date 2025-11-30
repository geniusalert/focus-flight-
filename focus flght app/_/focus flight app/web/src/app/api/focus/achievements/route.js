import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const achievements = await sql`
      SELECT *
      FROM achievements
      ORDER BY id ASC
    `;

    return Response.json({ achievements });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return Response.json(
      { error: "Failed to fetch achievements" },
      { status: 500 },
    );
  }
}
