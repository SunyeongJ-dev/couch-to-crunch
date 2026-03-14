// app/not-found.tsx
// Custom 404 page styled to match the Couch to Crunch theme.
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-8xl font-bold text-primary font-(family-name:--font-dm-sans) leading-none">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-text font-(family-name:--font-dm-sans)">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-2 text-text-500 font-(family-name:--font-inter) max-w-sm">
        Looks like you wandered off the mat. The page you&apos;re looking for
        can&apos;t be found.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 rounded-lg bg-primary text-white font-(family-name:--font-dm-sans) font-bold hover:bg-secondary transition duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
}
