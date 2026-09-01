import { Suspense } from "react";
import JoinMasjidClient from "./JoinMasjidClient";

export default function JoinMasjidPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-beige-200 rounded-lg w-48" />
        <div className="h-4 bg-beige-100 rounded w-80" />
        <div className="h-64 bg-beige-100 rounded-2xl mt-6" />
      </div>
    }>
      <JoinMasjidClient />
    </Suspense>
  );
}
