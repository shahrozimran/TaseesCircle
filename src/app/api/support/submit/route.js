import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeInput } from "@/lib/security";
import { sendNewQueryAlert } from "@/lib/email";

const VALID_RECIPIENTS = ["tasees_admin", "moderator"];
const VALID_PRIORITIES = ["low", "medium", "high"];

export async function POST(request) {
  try {
    // 1. Auth — server-side session check
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "You must be logged in to submit a query." }, { status: 401 });
    }

    // 2. Parse & validate body
    const body = await request.json();
    const { subject, message, recipient, priority, masjid_id } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
    }
    if (!VALID_RECIPIENTS.includes(recipient)) {
      return NextResponse.json({ error: "Invalid recipient." }, { status: 400 });
    }

    const sanitized = {
      subject:   sanitizeInput(subject, 150),
      message:   sanitizeInput(message, 3000),
      recipient: recipient,
      priority:  VALID_PRIORITIES.includes(priority) ? priority : "medium",
      masjid_id: masjid_id || null,
    };

    if (!sanitized.subject || !sanitized.message) {
      return NextResponse.json({ error: "Invalid subject or message content." }, { status: 400 });
    }

    // Prevent Circle Admin/Moderator from sending a query to themselves
    if (sanitized.recipient === "moderator" && sanitized.masjid_id) {
      const { data: memberRole } = await supabase
        .from("masjid_members")
        .select("role")
        .eq("user_id", user.id)
        .eq("masjid_id", sanitized.masjid_id)
        .maybeSingle();

      if (memberRole?.role === "admin" || memberRole?.role === "moderator") {
        return NextResponse.json(
          { error: "As a Circle Admin/Moderator, you cannot send queries to yourself. Please select TaseesCircle as the recipient." },
          { status: 400 }
        );
      }
    }

    // 3. Fetch user profile (for email + name in alert)
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    // 4. Insert ticket into DB
    const { data: ticket, error: insertError } = await supabase
      .from("support_tickets")
      .insert({
        user_id:  user.id,
        masjid_id: sanitized.masjid_id,
        recipient: sanitized.recipient,
        subject:   sanitized.subject,
        message:   sanitized.message,
        status:    "open",
        priority:  sanitized.priority,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Ticket insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit query. Please try again." }, { status: 500 });
    }

    // 5. Notify Super Admin (in-app notification)
    // Find the super admin's user ID
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", "admin_access@taseescircle.com")
      .single();

    if (adminProfile?.id) {
      await supabase.from("notifications").insert({
        user_id: adminProfile.id,
        title:   "New Support Query",
        message: `${profile?.full_name || "A user"} submitted: "${sanitized.subject}"`,
        type:    "new_ticket",
        link:    "/admin/tickets",
      });
    }

    // 6. Send email alert to admin — non-blocking, errors don't fail the request
    try {
      await sendNewQueryAlert(ticket, {
        full_name: profile?.full_name || "Unknown User",
        email:     profile?.email || user.email || "",
      });
    } catch (emailErr) {
      // Email failure is logged but doesn't block ticket creation
      console.error("Admin email alert failed:", emailErr.message);
    }

    return NextResponse.json({ success: true, ticketId: ticket.id }, { status: 201 });
  } catch (err) {
    console.error("Support submit error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
