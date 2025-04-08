import { businessCategorySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = businessCategorySchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.format() }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error in validate-category route:", err);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
