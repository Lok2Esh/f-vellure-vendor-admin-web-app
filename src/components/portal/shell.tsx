"use client";
import { LANGUAGES, MARKET_CONFIG } from "@/platform/market";
import { can } from "@/platform/domain";
import { adminRoutes, vendorRoutes } from "@/platform/routes";
import {
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  Package,
  PanelLeftClose,
  Scissors,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { usePortal } from "./providers";
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  Field,
  Heading,
  NavLink,
  Row,
  Stack,
  Text,
} from "./ui";
const icons: Record<string, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  appointments: CalendarDays,
  calendar: CalendarDays,
  orders: ShoppingBag,
  services: Scissors,
  products: Package,
  inventory: Boxes,
  staff: Users,
  branches: MapPin,
  customers: Users,
  promotions: Megaphone,
  reviews: Star,
  finance: Wallet,
  analytics: ChartNoAxesCombined,
  settings: Settings,
  support: CircleHelp,
};
const hi: Record<string, string> = {
  Overview: "होम",
  Appointments: "अपॉइंटमेंट्स",
  Calendar: "कैलेंडर",
  Orders: "ऑर्डर्स",
  Services: "सेवाएँ",
  Products: "प्रोडक्ट्स",
  Inventory: "स्टॉक",
  Staff: "कर्मचारी",
  Branches: "शाखाएँ",
  Customers: "ग्राहक",
  Promotions: "ऑफ़र",
  Reviews: "रिव्यू",
  Finance: "वित्त",
  Analytics: "विश्लेषण",
  Settings: "सेटिंग्स",
  "Help & support": "सहायता",
  "Business profile": "व्यवसाय प्रोफ़ाइल",
  Notifications: "सूचनाएँ",
};
export function Shell({ children }: { children: ReactNode }) {
  const { session, locale, setLocale } = usePortal();
  const path = usePathname();
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [account, setAccount] = useState(false);
  const initials = session.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const routes = (
    session.workspace === "vendor" ? vendorRoutes : adminRoutes
  ).filter((route) => can(session, route.permission));
  const active = routes
    .filter((r) => path.startsWith(r.path))
    .sort((a, b) => b.path.length - a.path.length)[0];
  return (
    <div className={`v-workspace ${collapsed ? "sidebar-hidden" : ""}`}>
      <a className="v-skip" href="#main-content">
        Skip to content
      </a>
      {mobile && (
        <button
          className="v-overlay"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`v-sidebar ${mobile ? "open" : ""}`}>
        <NavLink href={`/${session.workspace}/dashboard`} className="v-brand">
          <span className="v-brand-mark">v</span>
          <span>
            vellure<span className="v-brand-dot">.</span>
          </span>
        </NavLink>
        <Text className="v-workspace-label">
          {session.workspace === "vendor" ? "VENDOR PORTAL" : "ADMINISTRATION"}
        </Text>
        <NavLink
          href={`/${session.workspace}/${session.workspace === "vendor" ? "profile" : "settings"}`}
          className="v-business"
        >
          <Avatar name={session.workspace === "vendor" ? session.businessName?.[0] || "V" : "V"} />
          <Stack>
            <Text className="v-business-name">
              {session.workspace === "vendor"
                ? session.businessName || "Vendor workspace"
                : "Vellure Operations"}
            </Text>
            <Text muted>
              {session.workspace === "vendor"
                ? session.businessLocation || MARKET_CONFIG.country.name
                : "Marketplace console"}
            </Text>
          </Stack>
          <ChevronDown size={14} />
        </NavLink>
        <nav className="v-navigation" aria-label="Main navigation">
          {Array.from(new Set(routes.map((r) => r.group))).map((group) => (
            <div key={group}>
              <Text className="v-nav-label">{group}</Text>
              {routes
                .filter(
                  (r) =>
                    r.group === group &&
                    ![
                      "profile",
                      "notifications",
                      "support",
                      "settings",
                    ].includes(r.path.split("/").pop() || ""),
                )
                .map((route) => {
                  const Icon =
                    icons[route.path.split("/").pop() || ""] || LayoutDashboard;
                  return (
                    <NavLink
                      key={route.path}
                      href={route.path}
                      onClick={() => setMobile(false)}
                      className={`v-nav-item ${active?.path === route.path ? "active" : ""}`}
                      aria-current={
                        active?.path === route.path ? "page" : undefined
                      }
                    >
                      <Icon size={18} />
                      <span>
                        {locale === "hi"
                          ? hi[route.label] || route.label
                          : route.label}
                      </span>
                      {route.label === "Appointments" && (
                        <span className="v-nav-count">4</span>
                      )}
                    </NavLink>
                  );
                })}
            </div>
          ))}
        </nav>
        <div className="v-sidebar-bottom">
          <div className="v-partner-note">
            <Sparkles size={17} />
            <Text>Made for your next chapter.</Text>
            <NavLink href="/vendor/onboarding">
              Complete your business profile <ArrowUpRight size={13} />
            </NavLink>
          </div>
          <NavLink
            href={`/${session.workspace}/support`}
            className="v-nav-item"
          >
            <CircleHelp size={18} />
            Help & support
          </NavLink>
          <NavLink
            href={`/${session.workspace}/settings`}
            className="v-nav-item"
          >
            <Settings size={18} />
            Settings
          </NavLink>
          <Button
            variant="ghost"
            className="v-account"
            onClick={() => setAccount(true)}
          >
            <Avatar name={initials} />
            <Stack>
              <Text>{session.name}</Text>
              <Text muted>
                {session.workspace === "vendor"
                  ? "Business owner"
                  : "Administrator"}
              </Text>
            </Stack>
            <ChevronDown size={15} />
          </Button>
        </div>
      </aside>
      <div className="v-body">
        <header className="v-topbar">
          <Row>
            <Button
              variant="ghost"
              aria-label="Toggle navigation"
              onClick={() => {
                if (window.matchMedia("(max-width:650px)").matches)
                  setMobile(!mobile);
                else setCollapsed(!collapsed);
              }}
            >
              <Menu size={19} className="v-mobile-icon" />
              <PanelLeftClose size={18} className="v-desktop-icon" />
            </Button>
            <Text muted>
              {session.workspace === "vendor" ? "Workspace" : "Administration"}
            </Text>
            <ChevronRight size={13} />
            <Text>{active?.label || "Onboarding"}</Text>
          </Row>
          <Row>
            <Button
              variant="ghost"
              className="v-search-trigger"
              onClick={() => setSearch(true)}
            >
              <Search size={16} />
              <span>Search anything…</span>
              <kbd>⌘ K</kbd>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocale(locale === "en" ? "hi" : "en")}
              aria-label="Change language"
            >
              {LANGUAGES[locale === "en" ? "hi" : "en"].label}
            </Button>
            <NavLink
              href={`/${session.workspace}/notifications`}
              className="v-notification"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span />
            </NavLink>
            <Button
              variant="ghost"
              aria-label="Account menu"
              onClick={() => setAccount(true)}
            >
              <Avatar name={initials} />
            </Button>
          </Row>
        </header>
        <main id="main-content" className="v-main">
          {session.demo && (
            <Row className="v-demo">
              <span className="v-dot" />
              <Text>Demo workspace · Sample data as of 7 September 2026</Text>
              <Badge>
                {MARKET_CONFIG.currency.code} · {MARKET_CONFIG.timezone}
              </Badge>
            </Row>
          )}
          {children}
          <footer className="v-footer">
            <Text>© 2026 Vellure. A little more beautiful, every day.</Text>
            <Row>
              <ShieldCheck size={13} />
              <Text>Your business, in good hands.</Text>
            </Row>
          </footer>
        </main>
      </div>
      <Dialog
        open={search}
        onClose={() => setSearch(false)}
        title="Find your workspace"
      >
        <Field
          label="Search pages"
          placeholder="Try appointments, products, finance…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Stack className="v-search-results">
          {routes
            .filter((r) => r.label.toLowerCase().includes(query.toLowerCase()))
            .map((r) => (
              <NavLink
                key={r.path}
                href={r.path}
                onClick={() => setSearch(false)}
              >
                {r.label}
                <ChevronRight size={16} />
              </NavLink>
            ))}
        </Stack>
      </Dialog>
      <Dialog
        open={account}
        onClose={() => setAccount(false)}
        title="Your account"
      >
        <Stack>
          <Heading level={3}>{session.name}</Heading>
          <Text muted>
            {session.demo
              ? "You are exploring an isolated demo workspace."
              : "Your permissions are managed by your organization."}
          </Text>
          <NavLink href={`/${session.workspace}/settings`}>
            Account settings <ChevronRight size={16} />
          </NavLink>
          {session.demo && (
            <NavLink
              href={
                session.workspace === "vendor"
                  ? "/admin/dashboard"
                  : "/vendor/dashboard"
              }
            >
              Switch demo workspace <ChevronRight size={16} />
            </NavLink>
          )}
          <Button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              // Full reload clears cached tenant data and the authenticated router tree.
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              window.location.href = "/login";
            }}
          >
            <LogOut size={16} />
            Sign out
          </Button>
        </Stack>
      </Dialog>
    </div>
  );
}
