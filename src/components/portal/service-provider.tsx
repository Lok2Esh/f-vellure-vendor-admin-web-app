"use client";
import { VendorService, vendorService } from "@/platform/services";
import { createContext, ReactNode, useContext } from "react";

// Composition root: features depend on the narrow interface, never an adapter.
const VendorServiceContext = createContext<VendorService>(vendorService);
export function VendorServiceProvider({
  service = vendorService,
  children,
}: {
  service?: VendorService;
  children: ReactNode;
}) {
  return (
    <VendorServiceContext.Provider value={service}>
      {children}
    </VendorServiceContext.Provider>
  );
}
export function useVendorService(): VendorService {
  return useContext(VendorServiceContext);
}
