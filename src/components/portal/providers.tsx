"use client";
import { LANGUAGES, MARKET_CONFIG } from "@/platform/market";
import { Locale, Session } from "@/platform/domain";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";
import { VendorServiceProvider } from "./service-provider";
import { Button, Text } from "./ui";
const Context = createContext<{
  session: Session;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toast: (message: string) => void;
} | null>(null);
export function PortalProvider({
  session,
  children,
  initialLocale = MARKET_CONFIG.localization.defaultLanguage,
}: {
  session: Session;
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [message, setMessage] = useState("");
  return (
    <QueryClientProvider client={client}>
      <Context.Provider
        value={{
          session,
          locale,
          setLocale: (value) => {
            setLocale(value);
            document.cookie = `vellure_locale=${value}; Path=/; SameSite=Lax`;
            void client.invalidateQueries();
          },
          toast: setMessage,
        }}
      >
        <div
          className="v-portal"
          lang={locale}
          dir={LANGUAGES[locale].direction}
        >
          <VendorServiceProvider>{children}</VendorServiceProvider>
          {message && (
            <div className="v-toast" role="status">
              <Text>{message}</Text>
              <Button
                variant="ghost"
                onClick={() => setMessage("")}
                aria-label="Dismiss notification"
              >
                ×
              </Button>
            </div>
          )}
        </div>
      </Context.Provider>
    </QueryClientProvider>
  );
}
export function usePortal() {
  const value = useContext(Context);
  if (!value) throw new Error("PortalProvider is required");
  return value;
}
