import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeInput, validateEmail } from "@/lib/security";

export async function POST(request) {
  try {
    // 1. Extract IP Address from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1";

    // 2. Check Rate Limit: Max 5 submissions per IP every 15 minutes
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

    // 3. Parse and sanitize body
    const body = await request.json();
    const { name, email, country, subject, message } = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const sanitizedData = {
      name: sanitizeInput(name, 100),
      email: email.trim(),
      country: sanitizeInput(country, 50),
      subject: sanitizeInput(subject, 150),
      message: sanitizeInput(message, 2000),
    };

    if (!sanitizedData.name || !sanitizedData.subject || !sanitizedData.message) {
      return NextResponse.json(
        { error: "Required fields are missing or invalid." },
        { status: 400 }
      );
    }

    // 4. Return success with rate limit headers
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
    return NextResponse.json(
      { error: "Internal server error processing request." },
      { status: 500 }
    );
  }
}
