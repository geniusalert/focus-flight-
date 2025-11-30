import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const categories = await sql`
      SELECT *
      FROM categories
      ORDER BY id ASC
    `;

    return Response.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
