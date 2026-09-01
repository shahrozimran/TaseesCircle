import AdminLoginClient from "./AdminLoginClient";

export const metadata = {
  title: "Admin Login — Ta'sees Circle",
  description: "Administrator login for the Ta'sees Circle platform.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
