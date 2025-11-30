import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      UPDATE focus_sessions
      SET 
        status = 'in_progress',
        started_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    return Response.json({ session: result[0] });
  } catch (error) {
    console.error("Error starting session:", error);
    return Response.json({ error: "Failed to start session" }, { status: 500 });
  }
}
