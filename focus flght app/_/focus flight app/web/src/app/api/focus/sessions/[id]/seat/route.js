import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { seat } = body;

    const result = await sql`
      UPDATE focus_sessions
      SET seat = ${seat}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    return Response.json({ session: result[0] });
  } catch (error) {
    console.error("Error saving seat:", error);
    return Response.json({ error: "Failed to save seat" }, { status: 500 });
  }
}
