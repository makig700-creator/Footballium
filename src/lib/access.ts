export type Role = "USER" | "COACH" | "REFEREE" | "ADMIN";

export type Feature =
  | "VIEW_TOURNAMENTS"
  | "VIEW_MATCHES"
  | "VIEW_STATS"
  | "COMMENTS"
  | "MANAGE_TEAM"
  | "APPLY_TOURNAMENT"
  | "MATCH_LINEUP"
  | "LIVE_UPDATE_MATCH"
  | "CREATE_TOURNAMENT"
  | "MANAGE_NEWS";

const RolePermissions: Record<Role, Feature[]> = {
  USER: [
    "VIEW_TOURNAMENTS",
    "VIEW_MATCHES",
    "VIEW_STATS",
    "COMMENTS",
  ],
  COACH: [
    "VIEW_TOURNAMENTS",
    "VIEW_MATCHES",
    "VIEW_STATS",
    "COMMENTS",
    "MANAGE_TEAM",
    "APPLY_TOURNAMENT",
    "MATCH_LINEUP",
  ],
  REFEREE: [
    "VIEW_TOURNAMENTS",
    "VIEW_MATCHES",
    "VIEW_STATS",
    "COMMENTS",
    "LIVE_UPDATE_MATCH",
  ],
  ADMIN: [
    "VIEW_TOURNAMENTS",
    "VIEW_MATCHES",
    "VIEW_STATS",
    "COMMENTS",
    "MANAGE_TEAM",
    "APPLY_TOURNAMENT",
    "MATCH_LINEUP",
    "LIVE_UPDATE_MATCH",
    "CREATE_TOURNAMENT",
    "MANAGE_NEWS",
  ],
};

export function hasAccess(role: Role | string | null | undefined, feature: Feature): boolean {
  if (!role) return false;
  
  // Safe cast since we check if the role exists in the record
  const permissions = RolePermissions[role as Role];
  if (!permissions) return false;

  return permissions.includes(feature);
}

export function getDashboardPath(role: string | null | undefined): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "COACH":
      return "/coach/dashboard";
    case "REFEREE":
      return "/referee/dashboard";
    case "USER":
    default:
      return "/dashboard";
  }
}
