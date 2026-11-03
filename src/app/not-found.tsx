import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Lena Real Estate</p>
        <h1 className="mt-3 text-7xl text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">This page isn't on the market</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Go home</Link>
          <Link href="/properties" className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">Browse properties</Link>
        </div>
      </div>
    </div>
  );
}
