import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-text-primary">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-text-secondary">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary-hover"
        >
          Go Home
        </Link>
        <Link
          href="/search"
          className="rounded-xl border border-border px-6 py-3 font-medium text-text-primary transition hover:bg-gray-50"
        >
          Search Properties
        </Link>
      </div>
    </div>
  );
}
