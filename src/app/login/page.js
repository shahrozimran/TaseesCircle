import LoginClient from "./LoginClient";

export const metadata = {
  title: "Sign In — Ta'sees Circle Community",
  description:
    "Sign in to Ta'sees Circle with Google to join online discussion circles, save progress, and connect with Muslim communities in Pakistan and Canada.",
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
    description: "Sign in with Google to join online discussion circles and access community features.",
    url: "https://taseescircle.com/login",
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
