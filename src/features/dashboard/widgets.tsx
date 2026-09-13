"use client";
import { RevenueChart } from "@/components/portal/revenue-chart";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Heading,
  Inline,
  NavLink,
  Row,
  SegmentedControl,
  Stack,
  Text,
} from "@/components/portal/ui";
import {
  Appointment,
  Dashboard as DashboardData,
  Locale,
} from "@/platform/domain";
import { date, money, time, number } from "@/platform/format";
import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";

export function RevenuePanel({
  data,
  locale,
  period,
  setPeriod,
}: {
  data: DashboardData;
  locale: Locale;
  period: string;
  setPeriod: (value: string) => void;
}) {
  return (
    <Card className="v-revenue">
      <CardHeader
        title="Revenue overview"
        subtitle="A little growth, every day."
        action={
          <SegmentedControl
            value={period}
            values={["Today", "7 days", "30 days", "12 months"]}
            onChange={setPeriod}
          />
        }
      />
      <Row className="v-revenue-totals">
        <Stack>
          <Row>
            <Inline className="v-legend service" />
            <Text muted>Service revenue</Text>
          </Row>
          <Heading level={3}>{money(data.serviceRevenue, locale)}</Heading>
        </Stack>
        <Stack>
          <Row>
            <Inline className="v-legend product" />
            <Text muted>Product revenue</Text>
          </Row>
          <Heading level={3}>{money(data.productRevenue, locale)}</Heading>
        </Stack>
        <Badge status="positive">
          <TrendingUp size={13} />
          {data.changes.periodRevenue} vs. previous period
        </Badge>
      </Row>
      <RevenueChart data={data.trend} />
    </Card>
  );
}

export function DaySummary({
  data,
  setSelected,
}: {
  data: DashboardData;
  setSelected: (appointment: Appointment | null) => void;
}) {
  const next =
    data.appointmentsList.find((a) => a.status === "CONFIRMED") ??
    data.appointmentsList.find((a) => a.status === "PENDING");
  return (
    <Card className="v-day-card">
      <CardHeader
        title="Your day, at a glance"
        subtitle="Make room for a great day."
      />
      <Stack className="v-day-content">
        <Row className="between">
          <Text muted>Upcoming appointments</Text>
          <Text className="v-big-number">{number(data.upcoming)}</Text>
        </Row>
        <Box className="v-schedule-progress">
          <Inline />
          <Inline />
          <Inline />
          <Inline />
          <Inline />
          <Inline />
          <Inline />
          <Inline />
        </Box>
        <Row className="between">
          <Text muted className="v-small">
            A full day of feeling good
          </Text>
          <Badge status="positive">{data.occupancyPercent}% booked</Badge>
        </Row>
        {next ? (
          <Box className="v-next">
            <Row className="between">
              <Text className="v-eyebrow">UP NEXT</Text>
              <Badge status={next.status}>{time(next.startsAt)}</Badge>
            </Row>
            <Row>
              <Avatar name={next.initials} />
              <Stack>
                <Text className="v-table-name">{next.customer}</Text>
                <Text muted>{next.service}</Text>
              </Stack>
            </Row>
            <Row className="between">
              <Text muted className="v-small">
                {next.staff} · {next.duration} minutes
              </Text>
              <Button
                variant="ghost"
                onClick={() => setSelected(next)}
                aria-label="View next appointment"
              >
                <ArrowUpRight size={17} />
              </Button>
            </Row>
          </Box>
        ) : (
          <Text muted>No upcoming appointments.</Text>
        )}
        <NavLink href="/vendor/calendar" className="v-button secondary">
          <CalendarDays size={16} />
          Open calendar
          <ChevronRight size={16} />
        </NavLink>
      </Stack>
    </Card>
  );
}

export function PayoutPanel({
  data,
  locale,
  demo,
}: {
  data: DashboardData;
  locale: Locale;
  demo: boolean;
}) {
  return (
    <Card className="v-payout">
      <Row className="between">
        <Inline className="v-soft-icon">
          <Wallet size={20} />
        </Inline>
        <Badge status="positive">Scheduled</Badge>
      </Row>
      <Text muted>Upcoming payout</Text>
      <Heading level={2}>{money(data.payout.amount, locale)}</Heading>
      <Text muted>
        Expected{" "}
        {date(data.payout.expectedAt, locale, {
          day: "numeric",
          month: "short",
        })}{" "}
        · Bank transfer
      </Text>
      <Box className="v-payout-divider" />
      <Row>
        <CheckCircle2 size={15} />
        <Text className="v-small">
          {data.payout.bankVerified
            ? "Your bank account is verified"
            : "Bank verification required"}
        </Text>
      </Row>
      <NavLink href="/vendor/finance/payouts">
        View payout details <ArrowUpRight size={16} />
      </NavLink>
      <Text className="v-payout-note">
        {demo
          ? "Sample ledger balance."
          : "Balance provided by the Vellure ledger."}
      </Text>
    </Card>
  );
}

export function ActionOrdersPanel({
  data,
  locale,
}: {
  data: DashboardData;
  locale: Locale;
}) {
  return (
    <Card>
      <CardHeader
        title="Orders requiring action"
        action={
          <Badge status="pending">{data.actionOrders.length} orders</Badge>
        }
      />
      <Stack className="v-widget-list">
        {data.actionOrders.map((order) => (
          <NavLink
            href={`/vendor/orders/${order.id}`}
            className="v-order-row"
            key={order.id}
          >
            <Inline className="v-order-icon">
              <ShoppingBag size={19} />
            </Inline>
            <Stack>
              <Text className="v-table-name">#{order.id}</Text>
              <Text muted className="v-small">
                {order.customer} · {order.items} items
              </Text>
            </Stack>
            <Stack className="v-align-end">
              <Text>{money(order.total, locale)}</Text>
              <Badge status={order.status}>{order.status.toLowerCase()}</Badge>
            </Stack>
          </NavLink>
        ))}
      </Stack>
      <NavLink href="/vendor/orders" className="v-card-footer-link">
        Manage orders <ArrowUpRight size={15} />
      </NavLink>
    </Card>
  );
}

export function LowInventoryPanel({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader
        title="Low inventory"
        action={
          <Inline className="v-warning-icon">
            <AlertCircle size={18} />
          </Inline>
        }
      />
      <Stack className="v-widget-list">
        {data.inventory.map((product, i) => (
          <Row key={product.sku} className="v-stock-row">
            <Box className={`v-product-thumb p${i}`}>
              <Inline />
            </Box>
            <Stack>
              <Text className="v-table-name">{product.name}</Text>
              <Text muted className="v-small">
                {product.sku}
              </Text>
            </Stack>
            <Badge status="pending">{product.available} left</Badge>
          </Row>
        ))}
      </Stack>
      <NavLink href="/vendor/inventory" className="v-card-footer-link">
        Manage inventory <ArrowUpRight size={15} />
      </NavLink>
    </Card>
  );
}

export function ReviewsPanel({ data }: { data: DashboardData }) {
  return (
    <Card className="v-reviews">
      <CardHeader
        title="A little love from your customers"
        action={
          <NavLink href="/vendor/reviews">
            All reviews <ArrowUpRight size={15} />
          </NavLink>
        }
      />
      <Grid className="v-review-grid">
        {data.reviews.map((review) => (
          <Stack key={review.name} className="v-review">
            <Row className="between">
              <Row>
                <Avatar
                  name={review.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                />
                <Stack>
                  <Text className="v-table-name">{review.name}</Text>
                  <Text muted className="v-small">
                    {review.service}
                  </Text>
                </Stack>
              </Row>
              <Row
                className="v-stars"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={12} fill="currentColor" />
                ))}
              </Row>
            </Row>
            <Text muted>“{review.text}”</Text>
          </Stack>
        ))}
      </Grid>
    </Card>
  );
}
