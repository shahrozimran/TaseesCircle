import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeInput } from "@/lib/security";
import { sendQueryResponse } from "@/lib/email";

export async function POST(request) {
  try {
    // 1. Auth — must be Super Admin
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Verify super admin role
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfile?.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden — Super Admin only." }, { status: 403 });
    }

    // 2. Parse body
    const body = await request.json();
    const { ticketId, responseMessage } = body;

    if (!ticketId || !responseMessage?.trim()) {
      return NextResponse.json({ error: "Ticket ID and response message are required." }, { status: 400 });
    }

    const sanitizedResponse = sanitizeInput(responseMessage, 3000);
    if (!sanitizedResponse) {
      return NextResponse.json({ error: "Invalid response content." }, { status: 400 });
    }

    // 3. Fetch ticket + user info
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .select(`
        *,
        profiles(id, full_name, email)
      `)
      .eq("id", ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    // Resolve target user email robustly
    let userEmail = Array.isArray(ticket.profiles) ? ticket.profiles[0]?.email : ticket.profiles?.email;
    let userName = Array.isArray(ticket.profiles) ? ticket.profiles[0]?.full_name : ticket.profiles?.full_name;

    if (!userEmail && ticket.user_id) {
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", ticket.user_id)
        .maybeSingle();

      if (userProfile?.email) {
        userEmail = userProfile.email;
        userName = userProfile.full_name;
      }
    }

    // 4. Insert response
    const { data: responseRecord, error: responseError } = await supabase
      .from("ticket_responses")
      .insert({
        ticket_id:        ticketId,
        responded_by:     user.id,
        response_message: sanitizedResponse,
        email_sent:       false,
      })
      .select()
      .single();

    if (responseError) {
      console.error("Response insert error:", responseError);
      return NextResponse.json({ error: "Failed to save response." }, { status: 500 });
    }

    // 5. Update ticket status → 'responded'
    await supabase
      .from("support_tickets")
      .update({ status: "responded" })
      .eq("id", ticketId);

    // 6. In-app notification for the user
    if (ticket.user_id) {
      await supabase.from("notifications").insert({
        user_id: ticket.user_id,
        title:   "Response to Your Query",
        message: `Your query "${ticket.subject}" has received a response from TaseesCircle. Check your email and the "My Queries" section for the full reply.`,
        type:    "ticket_response",
        link:    "/dashboard/support",
      });
    }

    // 7. Log admin action
    await supabase.from("admin_actions").insert({
      admin_id:    user.id,
      ticket_id:   ticketId,
      action_type: "respond_ticket",
      notes:       `Responded to ticket: ${ticket.subject}`,
    });

    // 8. Send email to user — non-blocking
    let emailSent = false;
    if (userEmail) {
      try {
        console.log(`[Support Respond API] Sending email to user (${userEmail})...`);
        await sendQueryResponse(
          ticket,
          { response_message: sanitizedResponse },
          userEmail,
          userName || "Valued Member"
        );
        emailSent = true;

        // Mark email as sent
        await supabase
          .from("ticket_responses")
          .update({ email_sent: true })
          .eq("id", responseRecord.id);
        console.log(`[Support Respond API] Email successfully sent to ${userEmail}`);
      } catch (emailErr) {
        console.error("❌ User response email sending failed:", emailErr);
      }
    } else {
      console.warn(`⚠️ Cannot send response email: Could not resolve email for user_id ${ticket.user_id}`);
    }

    return NextResponse.json({ success: true, emailSent }, { status: 200 });
  } catch (err) {
    console.error("Support respond error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
