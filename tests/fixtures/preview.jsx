import React from "react";
import { createRoot } from "react-dom/client";
import LanguageProvider from "../../src/components/i18n/LanguageProvider";
import DashboardHeader from "../../src/components/dashboard/DashboardHeader";
import AdminLayout from "../../src/app/admin/layout";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "../../src/app/dashboard/page.js";
import Profile from "../../src/app/dashboard/profile/ProfileClient.js";
import Register from "../../src/app/dashboard/register-masjid/page.js";
import Join from "../../src/app/dashboard/join-masjid/JoinMasjidClient.js";
import Mycircle from "../../src/app/dashboard/my-circle/page.js";
import Circle from "../../src/app/dashboard/circles/[id]/page.js";
import Notifications from "../../src/app/dashboard/notifications/page.js";
import Support from "../../src/app/dashboard/support/page.js";
import Overview from "../../src/app/admin/page.js";
import Approvals from "../../src/app/admin/approvals/page.js";
import Circles from "../../src/app/admin/circles/page.js";
import Manage from "../../src/app/admin/circles/[id]/page.js";
import Users from "../../src/app/admin/users/page.js";
import Tickets from "../../src/app/admin/tickets/page.js";
const screens = {
  dashboard: Dashboard,
  profile: Profile,
  register: Register,
  join: Join,
  mycircle: Mycircle,
  circle: Circle,
  notifications: Notifications,
  support: Support,
  overview: Overview,
  approvals: Approvals,
  circles: Circles,
  manage: Manage,
  users: Users,
  tickets: Tickets,
};
const params = Promise.resolve({ id: "fixture-circle" });
function App() {
  const query = new URLSearchParams(location.search);
  const name = query.get("screen") || "dashboard";
  const Screen = screens[name] || Dashboard;
  const auth = useAuth();
  const admin = [
    "overview",
    "approvals",
    "circles",
    "manage",
    "users",
    "tickets",
  ].includes(name);
  return (
    <LanguageProvider initialLocale={query.get("lang") || "en"}>
      {admin ? (
        <AdminLayout>
          <Screen params={params} />
        </AdminLayout>
      ) : (
        <>
          <DashboardHeader {...auth} />
          <main className="max-w-7xl mx-auto p-4 sm:p-8">
            <Screen params={params} />
          </main>
        </>
      )}
    </LanguageProvider>
  );
}
createRoot(document.getElementById("root")).render(<App />);
