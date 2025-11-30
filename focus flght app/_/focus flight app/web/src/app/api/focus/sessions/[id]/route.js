import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
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
      WHERE fs.id = ${id}
    `;

    if (result.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    return Response.json({ session: result[0] });
  } catch (error) {
    console.error("Error fetching session:", error);
    return Response.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
