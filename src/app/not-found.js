import Link from "next/link";
import T from "@/components/i18n/T";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-32 text-center">
      <p className="text-6xl font-heading font-bold text-gold">404</p>
      <h1 className="mt-6 text-3xl font-heading font-bold text-charcoal-600">
        <T>Page not found</T>
      </h1>
      <p className="mt-4 text-charcoal-400">
        <T>The page you requested could not be found.</T>
      </p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        <T>Back to Website</T>
      </Link>
    </section>
  );
}
