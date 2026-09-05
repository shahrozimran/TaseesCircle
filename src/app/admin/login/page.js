import { localizeMetadata } from "@/lib/i18n/server";
import AdminLoginClient from "./AdminLoginClient";

const baseMetadata = {
  title: "Admin Login — Ta'sees Circle",
  description: "Administrator login for the Ta'sees Circle platform.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}

export async function generateMetadata() { return localizeMetadata(baseMetadata); }
