import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateEmail } from "@/lib/security";
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
    const rateCheck = checkRateLimit(`newsletter_${ip}`, 5, 15 * 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many subscription attempts. Please try again in ${Math.ceil(
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

    // 3. Validate email
    const body = await request.json();
    const { email } = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const normalisedEmail = email.trim().toLowerCase();

    // 4. Persist subscription BEFORE returning 200 (H-02)
    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const { error: dbError } = await supabase
      .from("newsletter_subscriptions")
      .insert({ email: normalisedEmail })
      .select()
      .single();

    // Ignore duplicate-email conflicts (unique constraint) — treat as success
    if (dbError && dbError.code !== "23505") {
      console.error("Newsletter subscription DB error:", dbError.code);
      return NextResponse.json(
        { error: "Failed to save your subscription. Please try again." },
        { status: 500 }
      );
    }

    // 5. Return success only after durable write
    return NextResponse.json(
      { success: true, message: "Subscription successful." },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      }
    );
  } catch (err) {
    console.error("Newsletter route error:", err.message);
    return NextResponse.json(
      { error: "Internal server error processing request." },
      { status: 500 }
    );
  }
}
