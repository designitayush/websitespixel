import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center section-padding pt-32 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-4xl font-bold text-offwhite">Page not found</h1>
      <p className="mt-4 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full border border-graphite-200/60 px-6 py-3 text-sm font-medium text-offwhite transition-colors hover:border-lime/40 hover:text-lime"
      >
        Back to home
      </Link>
    </section>
  );
}
