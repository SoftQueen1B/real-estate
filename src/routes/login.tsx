"use client";
import { Link, useNavigate } from "@/lib/legacy-router";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader as Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api-error";
import { useAuth } from "@/lib/auth";

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") ?? undefined;
  const redirect = redirectParam && redirectParam.startsWith("/") ? redirectParam : undefined;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!loading && user) navigate({ to: redirect ?? "/admin", replace: true });
  }, [loading, user, redirect, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFieldErrors({});
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.errors);
      } else setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-elegant">
        <Link to="/" className="font-display text-2xl text-burgundy">Lena <span className="text-gold">Real Estate</span></Link>
        <h1 className="mt-6 text-3xl">Staff sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Access the admin dashboard.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            {fieldErrors["email"]?.[0] && <p className="text-xs text-destructive">{fieldErrors["email"][0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            {fieldErrors["password"]?.[0] && <p className="text-xs text-destructive">{fieldErrors["password"][0]}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="animate-spin" />} Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
