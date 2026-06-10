"use client";

import { useSession } from "next-auth/react";
import { Role, Feature, hasAccess } from "@/lib/access";

export function useRole() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role as Role | undefined;

  return {
    role,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    can: (feature: Feature) => hasAccess(role, feature),
  };
}
