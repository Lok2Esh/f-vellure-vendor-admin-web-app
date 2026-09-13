"use client";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/platform/api/contracts";
import { MARKET_CONFIG } from "@/platform/market";
import { AuthLayout } from "./auth-layout";
import {
  Button,
  Checkbox,
  Field,
  Form,
  Grid,
  NavLink,
  Notice,
  Row,
  Select,
  Stack,
  Text,
} from "./ui";

export function RegisterForm() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    const form = new FormData(event.currentTarget);
    const parsed = registerSchema.safeParse(Object.fromEntries(form));
    const next: Record<string, string> = {};
    if (!parsed.success)
      for (const issue of parsed.error.issues)
        next[String(issue.path[0])] = issue.message;
    if (form.get("password") !== form.get("confirmPassword"))
      next.confirmPassword = "Passwords must match";
    if (form.get("consent") !== "on")
      next.consent = "Confirm you are registering your business";
    setErrors(next);
    if (Object.keys(next).length || !parsed.success) return;
    setBusy(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(
          body.error?.message ||
            "Unable to create your account. Please try again.",
        );
      window.location.assign(body.data.redirect);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
      setBusy(false);
    }
  }
  return (
    <AuthLayout
      title="Let’s grow your business."
      description="Create your vendor account to get started."
    >
      <Form onSubmit={submit} noValidate>
        <Stack>
          <Grid className="v-auth-name-grid">
            <Field
              label="First name"
              name="firstName"
              autoComplete="given-name"
              error={errors.firstName}
              required
            />
            <Field
              label="Last name"
              name="lastName"
              autoComplete="family-name"
              error={errors.lastName}
              required
            />
          </Grid>
          <Field
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            error={errors.email}
            required
          />
          <Select
            label="Phone country"
            value={MARKET_CONFIG.country.code}
            disabled
            options={[
              {
                value: MARKET_CONFIG.country.code,
                label: `${MARKET_CONFIG.country.name} (${MARKET_CONFIG.country.callingCode})`,
              },
            ]}
          />
          <Field
            label="Mobile number"
            name="phone"
            type="tel"
            autoComplete="tel-national"
            placeholder={MARKET_CONFIG.phone.placeholder}
            error={errors.phone}
            required
          />
          <Field
            label="Password"
            name="password"
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            error={errors.password}
            required
          />
          <Row className="between">
            <Text muted className="v-small">
              8+ characters, uppercase, lowercase and a number or symbol.
            </Text>
            <Button
              variant="ghost"
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible(!visible)}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </Row>
          <Field
            label="Confirm password"
            name="confirmPassword"
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            error={errors.confirmPassword}
            required
          />
          <Checkbox
            label="I am registering as a vendor to manage my business on Vellure."
            name="consent"
          />
          {errors.consent && <Notice tone="error">{errors.consent}</Notice>}
          {error && <Notice tone="error">{error}</Notice>}
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? "Creating your account…" : "Create vendor account"}
            <ArrowRight size={17} />
          </Button>
          <Text muted>
            Already a partner? <NavLink href="/login">Sign in</NavLink>
          </Text>
        </Stack>
      </Form>
    </AuthLayout>
  );
}
