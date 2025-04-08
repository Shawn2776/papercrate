import { businessTypeSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = businessTypeSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          message:
            parsed.error.format().businessType?._errors?.[0] ??
            "Invalid business type.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("POST /api/validate-business-type error:", err);
    return new Response(
      JSON.stringify({ message: "Server error. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
