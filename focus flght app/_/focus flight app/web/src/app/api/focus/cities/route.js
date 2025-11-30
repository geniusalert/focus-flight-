import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const cities = await sql`
      SELECT *
      FROM cities
      ORDER BY name ASC
    `;

    return Response.json({ cities });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return Response.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}
