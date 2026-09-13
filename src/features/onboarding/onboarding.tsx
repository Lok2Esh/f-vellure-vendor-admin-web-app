"use client";
import { MARKET_CONFIG } from "@/platform/market";
import { address } from "@/platform/format";
import {
  IndiaAddressFields,
  MobileField,
  BusinessIdentityFields,
} from "@/components/portal/market-fields";
import { usePortal } from "@/components/portal/providers";
import { useVendorService } from "@/components/portal/service-provider";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Checkbox,
  DetailList,
  Field,
  Form,
  Grid,
  Heading,
  NavLink,
  Notice,
  PageHeader,
  Row,
  Select,
  Skeleton,
  Stack,
  Text,
} from "@/components/portal/ui";
import { OnboardingInput, can, onboardingSchema } from "@/platform/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import { FormEvent, useState } from "react";

const initial: OnboardingInput = {
  registrationType: "Individual / Proprietor",
  legalName: "",
  pan: "",
  gstin: "",
  businessName: "",
  secondaryName: "",
  category: "Salon",
  ownerName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  addressLine2: "",
  landmark: "",
  district: "",
  state: "",
  postalCode: "",
  country: MARKET_CONFIG.country.code,
  terms: false,
};
const steps = [
  {
    title: "Your business",
    description: "Let’s start with your story",
    icon: Store,
  },
  {
    title: "Owner & contact",
    description: "The person behind the business",
    icon: UserRound,
  },
  {
    title: "Your location",
    description: "Help customers find you",
    icon: MapPin,
  },
  {
    title: "Review & submit",
    description: "Make a beautiful first impression",
    icon: ShieldCheck,
  },
];
const keys: (keyof OnboardingInput)[][] = [
  [
    "businessName",
    "secondaryName",
    "category",
    "registrationType",
    "legalName",
    "pan",
    "gstin",
  ],
  ["ownerName", "email", "phone"],
  [
    "city",
    "address",
    "addressLine2",
    "landmark",
    "district",
    "state",
    "postalCode",
    "country",
  ],
  ["terms"],
];
export default function Onboarding() {
  const vendorService = useVendorService();
  const { session, toast } = usePortal();
  const client = useQueryClient();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OnboardingInput | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof OnboardingInput, string>>
  >({});
  const query = useQuery({
    queryKey: ["application", session.id],
    queryFn: ({ signal }) => vendorService.application(signal),
  });
  const values = draft ?? query.data?.data ?? initial;
  const mutation = useMutation({
    mutationFn: ({ submit }: { submit: boolean }) =>
      vendorService.saveApplication(values, submit),
    onSuccess: (application) => {
      client.setQueryData(["application", session.id], application);
      toast(
        application.status === "SUBMITTED"
          ? "Your application has been submitted for review."
          : "Your draft has been saved.",
      );
    },
  });
  const update = <K extends keyof OnboardingInput>(
    key: K,
    value: OnboardingInput[K],
  ) => {
    setDraft({ ...values, [key]: value });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  function validate(onlyStep: boolean) {
    const result = onboardingSchema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Partial<Record<keyof OnboardingInput, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof OnboardingInput;
      if (!onlyStep || keys[step].includes(key)) next[key] = issue.message;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }
  function next(event: FormEvent) {
    event.preventDefault();
    if (!validate(true)) return;
    if (step < 3) setStep(step + 1);
    else if (validate(false)) mutation.mutate({ submit: true });
  }
  if (query.isPending) return <Skeleton />;
  if (query.isError)
    return (
      <Card>
        <Notice tone="error">{query.error.message}</Notice>
        <Button onClick={() => query.refetch()}>Try again</Button>
      </Card>
    );
  if (!can(session, "vendor.edit"))
    return <Notice>You don’t have permission to edit this application.</Notice>;
  if (query.data?.status === "SUBMITTED")
    return (
      <Stack>
        <PageHeader
          title="Your next chapter starts here."
          description="Your application is ready for the Vellure team."
        />
        <Card className="v-submitted">
          <CheckCircle2 size={48} />
          <Badge status="submitted">Submitted for review</Badge>
          <Heading level={1}>Looking good, {values.businessName}.</Heading>
          <Text muted>
            {session.demo
              ? "This demo submission is saved in this browser for 24 hours. No application has been sent to Vellure."
              : "We’ll review your business details and notify you of the next steps."}
          </Text>
          <DetailList
            items={[
              { label: "Application reference", value: query.data.id },
              { label: "Business", value: values.businessName },
              { label: "Contact email", value: values.email },
              { label: "Location", value: values.city },
            ]}
          />
          <Notice>
            Verification documents and bank information are collected through
            secure backend upload and verification services before approval.
          </Notice>
          <NavLink href="/vendor/dashboard" className="v-button primary">
            Back to overview <ArrowRight size={16} />
          </NavLink>
        </Card>
      </Stack>
    );
  return (
    <Stack>
      <PageHeader
        eyebrow="PARTNER ONBOARDING"
        title="A place for your business to bloom."
        description="Tell us a little about your business. We’ll take it from here."
        actions={
          <Badge status="draft">
            {query.data ? "Draft saved" : "New application"}
          </Badge>
        }
      />
      <Grid className="v-onboarding-grid">
        <Stack className="v-onboarding-steps">
          {steps.map(({ title, description, icon: Icon }, i) => (
            <Row
              key={title}
              className={`v-onboarding-step ${i === step ? "active" : ""} ${i < step ? "complete" : ""}`}
            >
              <Badge>
                {i < step ? <Check size={19} /> : <Icon size={19} />}
              </Badge>
              <Stack>
                <Heading level={3}>{title}</Heading>
                <Text muted>{description}</Text>
              </Stack>
            </Row>
          ))}
          <Card className="v-onboarding-help">
            <ShieldCheck size={24} />
            <Heading>Your business, protected.</Heading>
            <Text muted>
              Only authorized Vellure reviewers can access your application.
              Sensitive documents will be collected through secure verification.
            </Text>
            <NavLink href="/vendor/support">
              Need a little help? <ArrowRight size={15} />
            </NavLink>
          </Card>
        </Stack>
        <Card className="v-onboarding-form">
          <CardHeader
            title={steps[step].title}
            subtitle={`Step ${step + 1} of 4 · ${steps[step].description}`}
          />
          <Form onSubmit={next} noValidate>
            <Stack>
              {step === 0 && (
                <>
                  <Field
                    label="Business name · English"
                    autoComplete="organization"
                    placeholder="e.g. Glow & Grace Salon"
                    value={values.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    error={errors.businessName}
                    required
                    maxLength={120}
                  />
                  <Field
                    label="Business name · Hindi (optional)"
                    placeholder="अपने व्यवसाय का नाम"
                    dir="ltr"
                    lang="hi"
                    value={values.secondaryName}
                    onChange={(e) => update("secondaryName", e.target.value)}
                    error={errors.secondaryName}
                    maxLength={120}
                  />
                  <BusinessIdentityFields values={values} onChange={update} />
                  <Text className="v-field-label">Business category</Text>
                  <Select
                    label="Business category"
                    options={["Salon", "Spa", "Barber", "Wellness"].map(
                      (s) => ({ value: s, label: s }),
                    )}
                    value={values.category}
                    onChange={(e) =>
                      update(
                        "category",
                        e.target.value as OnboardingInput["category"],
                      )
                    }
                  />
                  <Notice>
                    Choose the category that best describes your business. You
                    can add individual services after onboarding.
                  </Notice>
                </>
              )}
              {step === 1 && (
                <>
                  <Field
                    label="Owner’s full name"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={values.ownerName}
                    onChange={(e) => update("ownerName", e.target.value)}
                    error={errors.ownerName}
                    required
                  />
                  <Field
                    label="Business email"
                    autoComplete="email"
                    type="email"
                    placeholder="hello@yoursalon.example"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                    error={errors.email}
                    required
                  />
                  <MobileField
                    value={values.phone}
                    onChange={(value) => update("phone", value)}
                    error={errors.phone}
                  />
                  <Text muted>
                    We’ll use these details for updates about your application.
                  </Text>
                </>
              )}
              {step === 2 && (
                <>
                  <IndiaAddressFields
                    values={values}
                    errors={errors}
                    onChange={update}
                  />
                  <Notice>
                    Exact map coordinates, branch hours and delivery areas are
                    configured in the Branches module using the geocoding
                    provider.
                  </Notice>
                  <Badge>
                    {MARKET_CONFIG.country.name} · {MARKET_CONFIG.currency.code}{" "}
                    · {MARKET_CONFIG.timezone}
                  </Badge>
                </>
              )}
              {step === 3 && (
                <>
                  <DetailList
                    items={[
                      { label: "Business name", value: values.businessName },
                      {
                        label: "Hindi name",
                        value: values.secondaryName || "Not provided",
                      },
                      { label: "Category", value: values.category },
                      {
                        label: "Business Registration Type",
                        value: values.registrationType,
                      },
                      {
                        label: "Business Legal Name",
                        value: values.legalName || "Not provided",
                      },
                      {
                        label: "PAN",
                        value: values.pan
                          ? `••••••${values.pan.slice(-4)}`
                          : "Not provided",
                      },
                      {
                        label: "GSTIN",
                        value: values.gstin
                          ? `•••••••••••${values.gstin.slice(-4)}`
                          : "Not provided",
                      },
                      { label: "Owner", value: values.ownerName },
                      { label: "Email", value: values.email },
                      { label: "Phone", value: values.phone },
                      {
                        label: "Location",
                        value: address(values),
                      },
                    ]}
                  />
                  <Notice>
                    {session.demo
                      ? "Demo mode: use sample details only. This application stays in a temporary browser cookie."
                      : "Submitting sends your application to the Vellure review team. Publication requires approval."}
                  </Notice>
                  <Checkbox
                    label="I confirm that these business details are accurate and authorize Vellure to review this application."
                    checked={values.terms}
                    onChange={(e) => update("terms", e.target.checked)}
                  />
                  {errors.terms && <Notice tone="error">{errors.terms}</Notice>}
                </>
              )}
              {mutation.isError && (
                <Notice tone="error">{mutation.error.message}</Notice>
              )}
              <Row className="v-form-footer between">
                <Button
                  disabled={step === 0 || mutation.isPending}
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
                <Row>
                  {
                    <Button
                      disabled={mutation.isPending}
                      onClick={() => {
                        mutation.mutate({ submit: false });
                      }}
                    >
                      Save draft
                    </Button>
                  }
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending
                      ? "Saving…"
                      : step === 3
                        ? "Submit application"
                        : "Continue"}
                    <ArrowRight size={16} />
                  </Button>
                </Row>
              </Row>
            </Stack>
          </Form>
        </Card>
      </Grid>
    </Stack>
  );
}
