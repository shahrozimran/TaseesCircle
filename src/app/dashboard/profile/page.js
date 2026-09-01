import { Suspense } from "react";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "Profile Settings — Ta'sees Circle",
  description: "Manage your profile details and preferences.",
};

function ProfileFallback() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse space-y-6">
      <div className="h-8 bg-beige-200 rounded-lg w-48" />
      <div className="h-4 bg-beige-100 rounded w-80" />
      <div className="h-64 bg-beige-100 rounded-2xl" />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <ProfileClient />
    </Suspense>
  );
}
