import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata = {
  title: "Sign In — Ta'sees Circle Community",
  description:
    "Sign in to Ta'sees Circle with Google or Email to join discussion circles, register your Masjid, and connect with Muslim communities in Pakistan and Canada.",
  keywords: [
    "Ta'sees Circle Login",
    "Islamic community sign in",
    "Google OAuth Ta'sees Circle",
  ],
  alternates: {
    canonical: "https://taseescircle.com/login",
  },
  openGraph: {
    title: "Sign In | Ta'sees Circle",
    description: "Sign in with Google or Email to join discussion circles and access community features.",
    url: "https://taseescircle.com/login",
  },
};

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 pt-24 pb-12 px-4">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-beige-200" />
        <div className="h-4 w-32 bg-beige-200 rounded" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginClient />
    </Suspense>
  );
}
