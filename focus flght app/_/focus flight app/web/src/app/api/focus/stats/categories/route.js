import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "day";

    const now = new Date();
    let startDate;

    if (period === "day") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const breakdown = await sql`
      SELECT 
        c.name,
        c.color,
        COALESCE(SUM(fs.actual_duration), 0) as minutes
      FROM categories c
      LEFT JOIN focus_sessions fs ON c.id = fs.category_id
        AND fs.status = 'completed'
        AND fs.completed_at >= ${startDate.toISOString()}
      GROUP BY c.id, c.name, c.color
      HAVING SUM(fs.actual_duration) > 0
      ORDER BY minutes DESC
    `;

    return Response.json({ breakdown });
  } catch (error) {
    console.error("Error fetching category breakdown:", error);
    return Response.json(
      { error: "Failed to fetch category breakdown" },
      { status: 500 },
    );
  }
}
