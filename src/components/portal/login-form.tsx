"use client";
import {
  Button,
  Field,
  Form,
  NavLink,
  Notice,
  Stack,
  Text,
} from "@/components/portal/ui";
import { AuthLayout } from "./auth-layout";
import { FormEvent, useState } from "react";
export function LoginForm({ demo }: { demo: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.get("identifier"),
          password: form.get("password"),
        }),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error?.message || "Unable to sign in.");
      window.location.href = body.data.redirect;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthLayout
      title="Welcome back."
      description="Sign in to your Vellure workspace."
    >
      <Form onSubmit={submit}>
        <Stack>
          <Field
            name="identifier"
            label="Email or mobile number"
            type="text"
            autoComplete="username"
            required
          />
          <Field
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            minLength={8}
            required
          />
          {error && <Notice tone="error">{error}</Notice>}
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </Stack>
      </Form>
      <Text muted>
        New to Vellure?{" "}
        <NavLink href="/register">Create a vendor account</NavLink>
      </Text>
      {demo && (
        <>
          <Notice>Demo mode is enabled. Explore with sample data.</Notice>
          <NavLink href="/vendor/dashboard" className="v-button secondary">
            Explore Vendor Portal
          </NavLink>
          <NavLink href="/admin/dashboard">
            Explore Administration Console
          </NavLink>
        </>
      )}
    </AuthLayout>
  );
}
