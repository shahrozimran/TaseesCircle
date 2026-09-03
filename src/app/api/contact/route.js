import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { normaliseInput, validateEmail } from "@/lib/security";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request) {
  try {
    // 1. Extract IP — trust rightmost entry in x-forwarded-for (M-02)
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp    = request.headers.get("x-real-ip");
    const ip = forwarded
      ? forwarded.split(",").at(-1).trim()
      : realIp || "127.0.0.1";

    // 2. Rate limit: max 5 per IP per 15 minutes
    const rateCheck = checkRateLimit(ip, 5, 15 * 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many submissions from your IP. Please try again in ${Math.ceil(
            rateCheck.resetSeconds / 60
          )} minutes.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.resetSeconds),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 3. Parse and normalise body
    const body = await request.json();
    const { name, email, country, subject, message } = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const normalisedData = {
      name:    normaliseInput(name, 100),
      email:   email.trim().toLowerCase(),
      country: normaliseInput(country, 50),
      subject: normaliseInput(subject, 150),
      message: normaliseInput(message, 2000),
    };

    if (!normalisedData.name || !normalisedData.subject || !normalisedData.message) {
      return NextResponse.json(
        { error: "Required fields are missing or invalid." },
        { status: 400 }
      );
    }

    // 4. Persist to DB BEFORE returning 200 (H-02)
    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert(normalisedData);

    if (dbError) {
      console.error("Contact submission DB error:", dbError.code);
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 }
      );
    }

    // 5. Return success only after durable write
    return NextResponse.json(
      { success: true, message: "Contact submission received successfully." },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      }
    );
  } catch (err) {
    console.error("Contact route error:", err.message);
    return NextResponse.json(
      { error: "Internal server error processing request." },
      { status: 500 }
    );
  }
}
