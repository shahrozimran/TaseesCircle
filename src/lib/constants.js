// ============================================
// TaseesCircle — Site Constants
// ============================================

export const SITE_NAME = "TaseesCircle";
export const SITE_TAGLINE = "Uniting Hearts, Building Communities";
export const SITE_DESCRIPTION =
  "An Islamic community engagement platform connecting Muslim communities in Pakistan and Canada through education, programs, and shared values.";

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
  { label: "Programs", href: "/programs" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/taseescircle",
  instagram: "https://instagram.com/taseescircle",
  youtube: "https://youtube.com/taseescircle",
  whatsapp: "https://wa.me/taseescircle",
};

export const STATS = [
  { label: "Community Members", value: 5000, suffix: "+" },
  { label: "Events Hosted", value: 200, suffix: "+" },
  { label: "Countries Active", value: 2, suffix: "" },
  { label: "Programs Running", value: 15, suffix: "+" },
];
