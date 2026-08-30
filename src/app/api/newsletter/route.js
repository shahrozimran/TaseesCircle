import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateEmail } from "@/lib/security";

export async function POST(request) {
  try {
    // 1. Extract IP Address from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1";

    // 2. Check Rate Limit: Max 5 subscription attempts per IP every 15 minutes
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

    // 3. Parse and validate body
    const body = await request.json();
    const { email } = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

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
    return NextResponse.json(
      { error: "Internal server error processing request." },
      { status: 500 }
    );
  }
}
