import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id } = body;

    // Get session details
    const sessionResult = await sql`
      SELECT *
      FROM focus_sessions
      WHERE id = ${session_id}
    `;

    if (sessionResult.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    const session = sessionResult[0];
    const newAchievements = [];

    // Check for achievements
    const achievements = await sql`
      SELECT *
      FROM achievements
    `;

    for (const achievement of achievements) {
      // Check if user already has this achievement
      const existingAchievement = await sql`
        SELECT id
        FROM user_achievements
        WHERE achievement_id = ${achievement.id}
      `;

      if (existingAchievement.length > 0) {
        continue;
      }

      let earned = false;

      // Check each achievement type
      if (achievement.requirement_type === "sessions_completed") {
        const totalSessions = await sql`
          SELECT COUNT(*) as count
          FROM focus_sessions
          WHERE status = 'completed'
        `;

        if (parseInt(totalSessions[0].count) >= achievement.requirement_value) {
          earned = true;
        }
      } else if (achievement.requirement_type === "single_session_minutes") {
        if (session.actual_duration >= achievement.requirement_value) {
          earned = true;
        }
      } else if (achievement.requirement_type === "consecutive_days") {
        // Check streak
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

        if (
          parseInt(streakResult[0]?.streak || 0) >=
          achievement.requirement_value
        ) {
          earned = true;
        }
      } else if (achievement.requirement_type === "total_hours") {
        const totalMinutes = await sql`
          SELECT SUM(actual_duration) as total
          FROM focus_sessions
          WHERE status = 'completed'
        `;

        const totalHours = parseInt(totalMinutes[0]?.total || 0) / 60;
        if (totalHours >= achievement.requirement_value) {
          earned = true;
        }
      } else if (achievement.requirement_type === "unique_destinations") {
        const uniqueDestinations = await sql`
          SELECT COUNT(DISTINCT destination_city_id) as count
          FROM focus_sessions
          WHERE status = 'completed'
        `;

        if (
          parseInt(uniqueDestinations[0].count) >= achievement.requirement_value
        ) {
          earned = true;
        }
      } else if (achievement.requirement_type === "sessions_in_day") {
        const today = new Date();
        const startOfDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );

        const todaySessions = await sql`
          SELECT COUNT(*) as count
          FROM focus_sessions
          WHERE status = 'completed'
            AND completed_at >= ${startOfDay.toISOString()}
        `;

        if (parseInt(todaySessions[0].count) >= achievement.requirement_value) {
          earned = true;
        }
      }

      if (earned) {
        await sql`
          INSERT INTO user_achievements (achievement_id)
          VALUES (${achievement.id})
        `;
        newAchievements.push(achievement);
      }
    }

    return Response.json({ newAchievements });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return Response.json(
      { error: "Failed to check achievements" },
      { status: 500 },
    );
  }
}
