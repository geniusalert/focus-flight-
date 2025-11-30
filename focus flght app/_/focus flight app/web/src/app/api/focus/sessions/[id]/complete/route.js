import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { actual_duration } = body;

    const result = await sql`
      UPDATE focus_sessions
      SET 
        status = 'completed',
        actual_duration = ${actual_duration},
        completed_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    return Response.json({ session: result[0] });
  } catch (error) {
    console.error("Error completing session:", error);
    return Response.json(
      { error: "Failed to complete session" },
      { status: 500 },
    );
  }
}
