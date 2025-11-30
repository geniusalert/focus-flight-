import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const routes = await sql`
      SELECT 
        dc.code as departure_code,
        dc.name as departure_name,
        dest.code as destination_code,
        dest.name as destination_name,
        COUNT(*) as flight_count,
        SUM(actual_duration) as total_minutes
      FROM focus_sessions fs
      JOIN cities dc ON fs.departure_city_id = dc.id
      JOIN cities dest ON fs.destination_city_id = dest.id
      WHERE fs.status = 'completed'
      GROUP BY dc.code, dc.name, dest.code, dest.name
      ORDER BY total_minutes DESC
    `;

    return Response.json({ routes });
  } catch (error) {
    console.error("Error fetching routes:", error);
    return Response.json({ error: "Failed to fetch routes" }, { status: 500 });
  }
}
