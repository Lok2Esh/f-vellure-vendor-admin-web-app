import { MARKET_CONFIG } from "@/platform/market";
import type { Metadata } from "next";
import "./globals.css";
import "./portal.css";
export const metadata: Metadata = {
  title: "Vellure · Partner Workspace",
  description:
    "The beauty and wellness business workspace. Appointments, commerce and growth, together.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={MARKET_CONFIG.localization.defaultLocale}>
      {/* Extensions can inject body attributes before hydration (e.g. cz-shortcut-listen).
          Limit suppression to this element; descendant hydration checks remain active. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
