"use client";
import { clsx } from "clsx";
import { ArrowUpRight, Inbox, X } from "lucide-react";
import Link from "next/link";
import { ComponentProps, ReactNode, useEffect, useRef } from "react";
export function Stack({
  children,
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={`v-stack ${className}`} {...props}>
      {children}
    </div>
  );
}
export function Row({
  children,
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={`v-row ${className}`} {...props}>
      {children}
    </div>
  );
}
export function Grid({
  children,
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={`v-grid ${className}`} {...props}>
      {children}
    </div>
  );
}
export function Text({
  children,
  muted = false,
  className = "",
  ...props
}: ComponentProps<"p"> & { muted?: boolean }) {
  return (
    <p className={clsx(muted && "v-muted", className)} {...props}>
      {children}
    </p>
  );
}
export function Heading({
  children,
  level = 2,
  className = "",
}: {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}) {
  const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
  return <Tag className={className}>{children}</Tag>;
}
export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <button
      type="button"
      className={`v-button ${variant} ${className}`}
      {...props}
    />
  );
}
export function NavLink({
  children,
  href,
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={`v-link ${className}`} {...props}>
      {children}
    </Link>
  );
}
export function Badge({
  children,
  status = "neutral",
}: {
  children: ReactNode;
  status?: string;
}) {
  return <span className={`v-badge ${status.toLowerCase()}`}>{children}</span>;
}
export function Avatar({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return <span className={`v-avatar ${className}`}>{name}</span>;
}
export function Card({
  children,
  className = "",
  ...props
}: ComponentProps<"section">) {
  return (
    <section className={`v-card ${className}`} {...props}>
      {children}
    </section>
  );
}
export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <Row className="v-card-header between">
      <Stack>
        <Heading>{title}</Heading>
        {subtitle && <Text muted>{subtitle}</Text>}
      </Stack>
      {action}
    </Row>
  );
}
export function Field({
  label,
  error,
  ...props
}: ComponentProps<"input"> & { label: string; error?: string }) {
  return (
    <label className="v-field">
      <span>{label}</span>
      <input {...props} aria-invalid={!!error} />
      {error && <small role="alert">{error}</small>}
    </label>
  );
}
export function Select({
  label,
  options,
  className = "",
  ...props
}: ComponentProps<"select"> & {
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className={`v-select ${className}`}>
      <span className="sr-only">{label}</span>
      <select aria-label={label} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
export function TextArea({label,error,...props}: ComponentProps<"textarea"> & {label:string;error?:string}) {
 return <label className="v-field"><span>{label}</span><textarea {...props} aria-invalid={!!error}/>{error&&<small role="alert">{error}</small>}</label>;
}
export function Checkbox({
  label,
  ...props
}: ComponentProps<"input"> & { label: ReactNode }) {
  return (
    <label className="v-check">
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <Row className="v-page-header between">
      <Stack>
        {eyebrow && <Text className="v-eyebrow">{eyebrow}</Text>}
        <Heading level={1}>{title}</Heading>
        <Text muted>{description}</Text>
      </Stack>
      {actions && <Row className="page-actions">{actions}</Row>}
    </Row>
  );
}
export function Metric({
  label,
  value,
  change,
  detail,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <Card className="v-metric">
      <Row className="between">
        <Text muted>{label}</Text>
        <span className="v-metric-icon">{icon}</span>
      </Row>
      <Text className="v-metric-value">{value}</Text>
      <Row className="v-metric-foot">
        <Badge status="positive">
          <ArrowUpRight size={12} />
          {change}
        </Badge>
        <Text muted>{detail}</Text>
      </Row>
    </Card>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Stack className="v-empty">
      <Inbox size={30} />
      <Heading>{title}</Heading>
      <Text muted>{description}</Text>
      {action}
    </Stack>
  );
}
export function Skeleton() {
  return (
    <Grid className="v-skeleton" aria-label="Loading content" aria-busy="true">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} />
      ))}{" "}
    </Grid>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  children,
  drawer = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={clsx("v-dialog", drawer && "drawer")}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <Row className="between">
        <Heading>{title}</Heading>
        <Button variant="ghost" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </Button>
      </Row>
      {children}
    </dialog>
  );
}
export function DetailList({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="v-details">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
export function SegmentedControl({
  value,
  values,
  onChange,
}: {
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Row className="v-segments">
      {values.map((item) => (
        <Button
          key={item}
          variant="ghost"
          aria-pressed={value === item}
          className={value === item ? "active" : ""}
          onClick={() => onChange(item)}
        >
          {item}
        </Button>
      ))}
    </Row>
  );
}
export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return (
    <div
      className={`v-notice ${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
export function Form(props: ComponentProps<"form">) {
  return <form className="v-form" {...props} />;
}
export function Box(props: ComponentProps<"div">) {
  return <div {...props} />;
}
export function Inline(props: ComponentProps<"span">) {
  return <span {...props} />;
}
export function Strong({ children }: { children: ReactNode }) {
  return <strong>{children}</strong>;
}
