// ============================================
// TaseesCircle — Site Constants
// ============================================

export const SITE_NAME = "Ta'sees Circle";
export const SITE_TAGLINE = "Uniting Hearts, Building Communities";
export const SITE_DESCRIPTION =
  "A digital Islamic community platform connecting Muslims in Pakistan and Canada through online knowledge sharing, discussions, and authentic Islamic guidance.";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Communities",
    href: "#",
    children: [
      { label: "Pakistan", href: "/pakistan" },
      { label: "Canada", href: "/canada" },
    ],
  },
  { label: "Discussions", href: "/discussions" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export const DASHBOARD_NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Circle", href: "/dashboard/my-circle", icon: "CircleDot", requiresCircle: true },
  { label: "Register Masjid", href: "/dashboard/register-masjid", icon: "Plus", hideIfCircle: true },
  { label: "Join Masjid", href: "/dashboard/join-masjid", icon: "Link", hideIfCircle: true },
  { label: "Notifications", href: "/dashboard/notifications", icon: "Bell" },
  { label: "Contact Support", href: "/dashboard/support", icon: "MessageSquare" },
  { label: "Profile", href: "/dashboard/profile", icon: "UserCircle" },
];

export const ADMIN_NAV_LINKS = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Masjid Approvals", href: "/admin/approvals", icon: "CheckCircle" },
  { label: "Support Tickets", href: "/admin/tickets", icon: "Ticket" },
  { label: "All Circles", href: "/admin/circles", icon: "CircleDot" },
  { label: "Users", href: "/admin/users", icon: "Users" },
];

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/taseescircle",
  instagram: "https://instagram.com/taseescircle",
  youtube: "https://youtube.com/taseescircle",
  whatsapp: "https://wa.me/taseescircle",
};

export const STATS = [
  { label: "Community Members", value: 5000, suffix: "+" },
  { label: "Sessions Conducted", value: 200, suffix: "+" },
  { label: "Countries Active", value: 2, suffix: "" },
  { label: "Programs Running", value: 15, suffix: "+" },
];
