import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const achievements = await sql`
      SELECT 
        ua.*,
        a.name,
        a.description,
        a.icon
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      ORDER BY ua.earned_at DESC
    `;

    return Response.json({ achievements });
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    return Response.json(
      { error: "Failed to fetch user achievements" },
      { status: 500 },
    );
  }
}
