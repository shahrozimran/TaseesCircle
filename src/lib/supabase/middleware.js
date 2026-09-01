import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip if Supabase not configured
  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl === "your_supabase_project_url" ||
    supabaseKey === "your_supabase_anon_key"
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh the auth session to keep it alive
  const { data: { user } } = await supabase.auth.getUser();

  // ============================================
  // Route Protection
  // ============================================
  const pathname = request.nextUrl.pathname;

  // Admin login page — always accessible (no protection)
  if (pathname === "/admin/login") {
    // If already logged in as admin, redirect to admin dashboard
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "super_admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return supabaseResponse;
  }

  // Protected routes - require authentication
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");

  // Dashboard routes — redirect to /login if not authenticated
  if (isDashboardRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes — redirect to /admin/login if not authenticated
  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Admin routes — check super_admin role
  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "super_admin") {
      // Not an admin — redirect to admin login with access denied
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // If user is logged in and visits /login, redirect to dashboard
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
