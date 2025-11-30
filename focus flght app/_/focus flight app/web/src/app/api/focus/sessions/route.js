import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");

    let query = `
      SELECT 
        fs.*,
        dc.code as departure_code,
        dc.name as departure_name,
        dest.code as destination_code,
        dest.name as destination_name,
        c.name as category_name,
        c.color as category_color
      FROM focus_sessions fs
      JOIN cities dc ON fs.departure_city_id = dc.id
      JOIN cities dest ON fs.destination_city_id = dest.id
      JOIN categories c ON fs.category_id = c.id
    `;

    const conditions = [];
    const values = [];

    if (status) {
      conditions.push(`fs.status = $${values.length + 1}`);
      values.push(status);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY fs.created_at DESC LIMIT $${values.length + 1}`;
    values.push(limit);

    const sessions = await sql(query, values);

    return Response.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return Response.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      departure_city_id,
      destination_city_id,
      category_id,
      planned_duration,
      goal_text,
    } = body;

    if (
      !departure_city_id ||
      !destination_city_id ||
      !category_id ||
      !planned_duration
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Calculate miles earned (1 mile per minute)
    const miles_earned = planned_duration;

    const result = await sql`
      INSERT INTO focus_sessions (
        departure_city_id,
        destination_city_id,
        category_id,
        planned_duration,
        goal_text,
        miles_earned,
        status
      )
      VALUES (
        ${departure_city_id},
        ${destination_city_id},
        ${category_id},
        ${planned_duration},
        ${goal_text || null},
        ${miles_earned},
        'planned'
      )
      RETURNING *
    `;

    return Response.json({ session: result[0] });
  } catch (error) {
    console.error("Error creating session:", error);
    return Response.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
