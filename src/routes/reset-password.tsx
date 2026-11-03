"use client";
import { Link, useNavigate } from "@/lib/legacy-router";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader as Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api-error";
import { api } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { DATA_MODE } from "@/lib/data-mode";

export function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    setFieldErrors({});
    try {
      if (DATA_MODE === "mock") {
        navigate({ to: "/login", replace: true });
      } else {
        await api.post(endpoints.auth.resetPassword, { token, email, password, password_confirmation: confirm });
        navigate({ to: "/login", replace: true });
      }
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
        <h1 className="mt-6 text-3xl">Create a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong password for your account.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            {fieldErrors["password"]?.[0] && <p className="text-xs text-destructive">{fieldErrors["password"][0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            {fieldErrors["password_confirmation"]?.[0] && <p className="text-xs text-destructive">{fieldErrors["password_confirmation"][0]}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="animate-spin" />} Reset password
          </Button>
        </form>
        <Link to="/login" className="mt-4 block text-center text-xs text-primary hover:underline">
          Return to sign in
        </Link>
      </div>
    </div>
  );
}
