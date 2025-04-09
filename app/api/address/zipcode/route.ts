import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const zip = searchParams.get("zip");

  if (!zip || zip.length !== 5) {
    return NextResponse.json({ error: "Invalid ZIP" }, { status: 400 });
  }

  // Check cache first
  const cached = await prisma.zipCache.findUnique({
    where: { zip },
    include: { cities: true },
  });

  if (cached) {
    return NextResponse.json({
      city: cached.city,
      state: cached.state,
      acceptableCities: cached.cities.map((c) => c.name),
      source: "cache",
    });
  }

  // Fetch from ZipCodeAPI if not cached
  try {
    console.log("trying to fetch from ZipCodeAPI 3");

    const apiKey = process.env.ZIPCODE_API_KEY;
    if (!apiKey) {
      throw new Error("ZIPCODE_API_KEY not set in environment");
    }

    const res = await fetch(
      `https://www.zipcodeapi.com/rest/${apiKey}/info.json/${zip}/degrees`
    );

    const data = await res.json();

    if (!res.ok || !data.city || !data.state) {
      console.error("ZipCodeAPI returned invalid data:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      return NextResponse.json(
        { error: "Invalid ZIP or no data from external API" },
        { status: 502 }
      );
    }

    const zipRecord = await prisma.zipCache.create({
      data: {
        zip,
        city: data.city,
        state: data.state,
        lat: data.lat,
        lng: data.lng,
        cities: {
          createMany: {
            data: (data.acceptable_city_names ?? []).map(
              (c: { city: string; state: string }) => ({
                name: c.city,
                state: c.state,
              })
            ),
          },
        },
      },
      include: { cities: true },
    });

    return NextResponse.json({
      city: zipRecord.city,
      state: zipRecord.state,
      acceptableCities: zipRecord.cities.map((c) => c.name),
      source: "api",
    });
  } catch (err) {
    console.error("ZIP lookup failed:", err);
    return NextResponse.json({ error: "ZIP lookup failed" }, { status: 500 });
  }
}
