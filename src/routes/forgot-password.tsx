"use client";
import { Link, useNavigate } from "@/lib/legacy-router";
import { useState, type FormEvent } from "react";
import { Loader as Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api-error";
import { api } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { DATA_MODE } from "@/lib/data-mode";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (DATA_MODE === "mock") {
        setSent(true);
      } else {
        await api.post(endpoints.auth.forgotPassword, { email });
        setSent(true);
      }
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
        <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-elegant">
          <Link to="/" className="font-display text-2xl text-burgundy">Lena <span className="text-gold">Real Estate</span></Link>
          <h1 className="mt-6 text-3xl">Check your inbox</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account exists for {email}, we&apos;ve sent secure instructions to reset your password.
          </p>
          <Button className="mt-6 w-full" onClick={() => navigate({ to: "/login" })}>
            Return to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-elegant">
        <Link to="/" className="font-display text-2xl text-burgundy">Lena <span className="text-gold">Real Estate</span></Link>
        <h1 className="mt-6 text-3xl">Recover your access</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your email and we&apos;ll send secure instructions.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <div className="space-y-1.5">
            <Label htmlFor="email">Account email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="animate-spin" />} Send secure link
          </Button>
        </form>
        <Link to="/login" className="mt-4 block text-center text-xs text-primary hover:underline">
          Return to sign in
        </Link>
      </div>
    </div>
  );
}
