"use client";
import { Permission, can } from "@/platform/domain";
import { ReactNode } from "react";
import { usePortal } from "./providers";
export function PermissionGate({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { session } = usePortal();
  return can(session, permission) ? children : null;
}
