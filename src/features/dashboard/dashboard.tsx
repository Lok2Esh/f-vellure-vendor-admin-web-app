"use client";
import { Column, DataTable } from "@/components/portal/data-table";
import { PermissionGate } from "@/components/portal/permission";
import { MARKET_CONFIG } from "@/platform/market";
import { usePortal } from "@/components/portal/providers";
import { useVendorService } from "@/components/portal/service-provider";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  DetailList,
  Dialog,
  EmptyState,
  Grid,
  Heading,
  Inline,
  Metric,
  NavLink,
  Notice,
  PageHeader,
  Row,
  Select,
  Skeleton,
  Stack,
  Strong,
  Text,
} from "@/components/portal/ui";
import { Appointment, Permission, can } from "@/platform/domain";
import { date, money, time, number } from "@/platform/format";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Package,
  Plus,
  Scissors,
  ShoppingBag,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  ActionOrdersPanel,
  DaySummary,
  LowInventoryPanel,
  PayoutPanel,
  RevenuePanel,
  ReviewsPanel,
} from "./widgets";

const actionPermission = (href: string): Permission =>
  href.startsWith("services") || href.startsWith("products")
    ? "catalog.edit"
    : href.startsWith("promotions")
      ? "promotion.create"
      : "appointment.edit";
export default function Dashboard() {
  const vendorService = useVendorService();
  const { locale, session } = usePortal();
  const [period, setPeriod] = useState("7 days");
  const [branchId, setBranchId] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [quick, setQuick] = useState(false);
  const query = useQuery({
    queryKey: ["vendor", session.vendorId, "dashboard", period, branchId],
    queryFn: ({ signal }) =>
      vendorService.dashboard({ period, branchId }, signal),
  });
  const data = query.data;
  const columns: Column<Appointment>[] = [
    {
      id: "customer",
      label: "Customer",
      sortValue: (a) => a.customer,
      render: (a) => (
        <Row>
          <Avatar name={a.initials} />
          <Stack>
            <Text className="v-table-name">{a.customer}</Text>
            <Text muted className="v-small">
              #{a.id}
            </Text>
          </Stack>
        </Row>
      ),
    },
    {
      id: "service",
      label: "Service / Staff",
      sortValue: (a) => a.service,
      render: (a) => (
        <Stack>
          <Text>{a.service}</Text>
          <Text muted className="v-small">
            {a.staff} · {a.duration} min
          </Text>
        </Stack>
      ),
    },
    {
      id: "time",
      label: "Time",
      sortValue: (a) => a.startsAt,
      exportValue: (a) => time(a.startsAt),
      render: (a) => <Text className="v-time">{time(a.startsAt, locale)}</Text>,
    },
    {
      id: "amount",
      label: "Amount",
      sortValue: (a) => a.price.amount,
      exportValue: (a) => money(a.price),
      render: (a) => (
        <Text className="v-table-name">{money(a.price, locale)}</Text>
      ),
    },
    {
      id: "status",
      label: "Status",
      sortValue: (a) => a.status,
      render: (a) => (
        <Badge status={a.status}>
          {a.status.replaceAll("_", " ").toLowerCase()}
        </Badge>
      ),
    },
  ];
  if (query.isPending) return <Skeleton />;
  if (query.isError || !data)
    return (
      <Card>
        <EmptyState
          title="We couldn’t load your overview"
          description={query.error?.message || "Try again in a moment."}
          action={<Button onClick={() => query.refetch()}>Try again</Button>}
        />
      </Card>
    );
  return (
    <Stack className="v-dashboard">
      <PageHeader
        eyebrow={date(data.date, locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        title={
          locale === "hi"
            ? `स्वागत है, ${session.name.split(" ")[0]}`
            : `A beautiful day for business, ${session.name.split(" ")[0]}.`
        }
        description={
          locale === "hi"
            ? "आज आपके सैलून में क्या हो रहा है।"
            : `Here’s what’s happening at ${data.businessName} today.`
        }
        actions={
          <>
            <Select
              label="Branch"
              options={data.branches}
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            />
            <Button variant="primary" onClick={() => setQuick(true)}>
              <Plus size={17} />
              Create new
            </Button>
          </>
        }
      />
      <Row className="v-overview-tabs between">
        <Row>
          <Button variant="ghost" className="active">
            {locale === "hi" ? "होम" : "Overview"}
          </Button>
          <NavLink href="/vendor/analytics">
            Analytics <ArrowUpRight size={13} />
          </NavLink>
        </Row>
        <Row className="v-period-note">
          <Inline className="v-dot" />
          <Text>Business hours · {data.businessHours}</Text>
        </Row>
      </Row>
      <Grid className="v-kpis">
        <Metric
          label="Today’s revenue"
          value={money(data.revenue, locale)}
          change={data.changes.revenue}
          detail="vs. yesterday"
          icon={<Wallet size={18} />}
        />
        <Metric
          label="Appointments today"
          value={number(data.appointments)}
          change={data.changes.appointments}
          detail="vs. yesterday"
          icon={<CalendarDays size={18} />}
        />
        <Metric
          label="Product orders today"
          value={number(data.orders)}
          change={data.changes.orders}
          detail="vs. yesterday"
          icon={<ShoppingBag size={18} />}
        />
        <Metric
          label="Customer rating"
          value={`${data.rating} / 5`}
          change={data.changes.rating}
          detail={`from ${number(data.ratingCount)} reviews`}
          icon={<Star size={18} />}
        />
      </Grid>
      <Row className="v-attention-strip">
        <Row>
          <Inline className="v-soft-icon">
            <Clock3 size={16} />
          </Inline>
          <Text>
            <Strong>{number(data.pendingAppointments)}</Strong> appointments awaiting
            confirmation
          </Text>
          <NavLink href="/vendor/appointments">
            Review <ChevronRight size={14} />
          </NavLink>
        </Row>
        <Row>
          <ShoppingBag size={16} />
          <Text>
            <Strong>{number(data.pendingOrders)}</Strong> orders need your attention
          </Text>
        </Row>
        <Row>
          <Package size={16} />
          <Text>
            <Strong>{number(data.lowStock)}</Strong> products running low
          </Text>
        </Row>
      </Row>
      <Grid className="v-main-grid">
        <RevenuePanel
          data={data}
          locale={locale}
          period={period}
          setPeriod={setPeriod}
        />
        <DaySummary data={data} setSelected={setSelected} />
        <Card className="v-appointments">
          <CardHeader
            title="Today’s appointments"
            subtitle="Every appointment is a chance to make someone’s day."
            action={
              <NavLink href="/vendor/appointments">
                View all <ArrowUpRight size={15} />
              </NavLink>
            }
          />
          <DataTable
            rows={data.appointmentsList.filter(
              (a) => status === "all" || a.status === status,
            )}
            columns={columns}
            searchText={(a) => `${a.customer} ${a.service} ${a.id} ${a.staff}`}
            onSelect={setSelected}
            caption={`Today’s appointments in ${MARKET_CONFIG.timezone}`}
            filter={
              <Select
                label="Appointment status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "all", label: "All statuses" },
                  ...["PENDING", "CONFIRMED", "CHECKED_IN"].map((s) => ({
                    value: s,
                    label: s.toLowerCase().replaceAll("_", " "),
                  })),
                ]}
              />
            }
          />
        </Card>
        <PermissionGate permission="finance.view">
          <PayoutPanel data={data} locale={locale} demo={session.demo} />
        </PermissionGate>
        <ActionOrdersPanel data={data} locale={locale} />
        <LowInventoryPanel data={data} />
        <ReviewsPanel data={data} />
      </Grid>
      <Row className="v-quick-actions">
        <Sparkles size={18} />
        <Text>Good things start with a little action.</Text>
        {[
          ["services/new", "Add service"],
          ["products/new", "Add product"],
          ["appointments", "Create appointment"],
          ["calendar", "Manage calendar"],
          ["promotions/new", "Create promotion"],
        ]
          .filter(([href]) => can(session, actionPermission(href)))
          .map(([href, label]) => (
            <NavLink href={`/vendor/${href}`} key={href}>
              {label}
              <Plus size={13} />
            </NavLink>
          ))}
      </Row>
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Appointment details"
        drawer
      >
        {selected && (
          <Stack>
            <Row>
              <Avatar name={selected.initials} />
              <Stack>
                <Heading>{selected.customer}</Heading>
                <Text muted>#{selected.id}</Text>
              </Stack>
              <Badge status={selected.status}>
                {selected.status.toLowerCase().replaceAll("_", " ")}
              </Badge>
            </Row>
            <DetailList
              items={[
                { label: "Service", value: selected.service },
                { label: "Staff", value: selected.staff },
                {
                  label: "Branch",
                  value:
                    data.branches.find(
                      (branch) => branch.value === selected.branchId,
                    )?.label || selected.branchId,
                },
                { label: "Date", value: date(selected.startsAt, locale) },
                { label: "Start time", value: time(selected.startsAt, locale) },
                { label: "Duration", value: `${selected.duration} minutes` },
                { label: "Total", value: money(selected.price, locale) },
                {
                  label: "Payment",
                  value: (
                    <Badge status={selected.payment}>
                      {selected.payment.toLowerCase()}
                    </Badge>
                  ),
                },
                { label: "Customer notes", value: selected.notes },
              ]}
            />
            <Notice>
              Scheduling actions will be available when the appointments module
              is connected to the booking service.
            </Notice>
            <NavLink
              href={`/vendor/appointments/${selected.id}`}
              className="v-button primary"
            >
              Open appointment <ArrowUpRight size={16} />
            </NavLink>
          </Stack>
        )}
      </Dialog>
      <Dialog
        open={quick}
        onClose={() => setQuick(false)}
        title="Create something beautiful"
      >
        <Stack className="v-quick-menu">
          {[
            [Scissors, "Add a service", "services/new"],
            [Package, "Add a product", "products/new"],
            [CalendarDays, "Create an appointment", "appointments"],
            [Sparkles, "Create a promotion", "promotions/new"],
          ]
            .filter(([, , href]) =>
              can(session, actionPermission(String(href))),
            )
            .map(([Icon, label, href]) => {
              const I = Icon as typeof Scissors;
              return (
                <NavLink key={String(href)} href={`/vendor/${href}`}>
                  <I size={21} />
                  {String(label)}
                  <ChevronRight size={16} />
                </NavLink>
              );
            })}
          <PermissionGate permission="vendor.edit">
            <NavLink href="/vendor/onboarding">
              <CheckCircle2 size={21} />
              Complete business onboarding
              <ChevronRight size={16} />
            </NavLink>
          </PermissionGate>
        </Stack>
      </Dialog>
    </Stack>
  );
}
