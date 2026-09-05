import { localizeMetadata } from "@/lib/i18n/server";
import { Suspense } from "react";
import JoinLandingClient from "./JoinLandingClient";

const baseMetadata = {
  title: "Join a Masjid Circle — Ta'sees Circle",
  description: "Join a Masjid circle using a code or referral link. Connect with your community on Ta'sees Circle.",
};

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-beige-50">
        <div className="animate-pulse w-12 h-12 rounded-full bg-beige-200" />
      </div>
    }>
      <JoinLandingClient />
    </Suspense>
  );
}

export async function generateMetadata() { return localizeMetadata(baseMetadata); }
