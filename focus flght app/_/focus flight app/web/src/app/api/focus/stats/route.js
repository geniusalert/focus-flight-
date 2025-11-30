import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get today's minutes
    const todayResult = await sql`
      SELECT COALESCE(SUM(actual_duration), 0) as minutes
      FROM focus_sessions
      WHERE status = 'completed'
        AND completed_at >= ${startOfToday.toISOString()}
    `;

    // Get this week's minutes
    const weekResult = await sql`
      SELECT COALESCE(SUM(actual_duration), 0) as minutes
      FROM focus_sessions
      WHERE status = 'completed'
        AND completed_at >= ${startOfWeek.toISOString()}
    `;

    // Get this month's minutes
    const monthResult = await sql`
      SELECT COALESCE(SUM(actual_duration), 0) as minutes
      FROM focus_sessions
      WHERE status = 'completed'
        AND completed_at >= ${startOfMonth.toISOString()}
    `;

    // Calculate streak
    const streakResult = await sql`
      WITH daily_sessions AS (
        SELECT DATE(completed_at) as session_date
        FROM focus_sessions
        WHERE status = 'completed'
        GROUP BY DATE(completed_at)
        ORDER BY DATE(completed_at) DESC
      ),
      streak_calc AS (
        SELECT 
          session_date,
          DATE(session_date) - ROW_NUMBER() OVER (ORDER BY session_date DESC) * INTERVAL '1 day' as streak_group
        FROM daily_sessions
      )
      SELECT COUNT(*) as streak
      FROM streak_calc
      WHERE streak_group = (
        SELECT streak_group
        FROM streak_calc
        LIMIT 1
      )
    `;

    // Get total flights
    const totalFlightsResult = await sql`
      SELECT COUNT(*) as total
      FROM focus_sessions
      WHERE status = 'completed'
    `;

    return Response.json({
      todayMinutes: parseInt(todayResult[0]?.minutes || 0),
      weekMinutes: parseInt(weekResult[0]?.minutes || 0),
      monthMinutes: parseInt(monthResult[0]?.minutes || 0),
      streak: parseInt(streakResult[0]?.streak || 0),
      totalFlights: parseInt(totalFlightsResult[0]?.total || 0),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
