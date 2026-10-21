import { Asset } from "../app/shared"

export type UserRole = "admin" | "analyst" | "manager" | "viewer"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  affiliate: string
}

export interface AssetPermissions {
  assetId: string
  allowedRoles: UserRole[]
  allowedAffiliates: string[]
  isPublic: boolean
}

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@company.com",
    role: "analyst",
    affiliate: "North America",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria@company.com",
    role: "manager",
    affiliate: "Europe",
  },
  {
    id: "3",
    name: "James Chen",
    email: "james@company.com",
    role: "viewer",
    affiliate: "North America",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@company.com",
    role: "admin",
    affiliate: "Global",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@company.com",
    role: "analyst",
    affiliate: "APAC",
  },
]

export const ROLE_PERMISSIONS: Record<
  UserRole,
  { label: string; color: string; assets: string[]; affiliates: string[] }
> = {
  admin: {
    label: "Administrator",
    color: "bg-gray-200 text-gray-700",
    assets: ["All KPIs", "All Layouts", "All Storyboards"],
    affiliates: ["Global", "North America", "Europe", "APAC", "LATAM"],
  },
  manager: {
    label: "Manager",
    color: "bg-gray-200 text-gray-700",
    assets: ["KPIs", "Layouts", "Storyboards"],
    affiliates: ["Global", "North America", "Europe", "APAC"],
  },
  analyst: {
    label: "Analyst",
    color: "bg-gray-200 text-gray-700",
    assets: ["KPIs", "Layouts"],
    affiliates: ["North America", "Europe", "APAC"],
  },
  viewer: {
    label: "Viewer",
    color: "bg-gray-200 text-gray-700",
    assets: ["Featured KPIs", "Public Layouts"],
    affiliates: ["North America"],
  },
}

export function checkAssetAccess(
  asset: Asset,
  user: User,
): { hasAccess: boolean; reason?: string } {
  const { allowedRoles, allowedAffiliates } = getAssetPermissions(asset)

  if (user.role === "admin") {
    return { hasAccess: true }
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      hasAccess: false,
      reason: `Role "${ROLE_PERMISSIONS[user.role].label}" does not have permission for this asset type`,
    }
  }

  if (
    !allowedAffiliates.includes(user.affiliate) &&
    !allowedAffiliates.includes("Global")
  ) {
    return {
      hasAccess: false,
      reason: `Affiliate "${user.affiliate}" is not allowed for this asset`,
    }
  }

  return { hasAccess: true }
}

function getAssetPermissions(asset: Asset): AssetPermissions {
  const { type, featured } = asset
  const affiliates = (asset.details.affiliateApplicability as string[]) || [
    "Global",
  ]

  let allowedRoles: UserRole[] = ["admin"]

  switch (type) {
    case "kpi":
      allowedRoles = featured
        ? ["admin", "manager", "analyst", "viewer"]
        : ["admin", "manager", "analyst"]
      break
    case "layout":
      allowedRoles = featured
        ? ["admin", "manager", "analyst", "viewer"]
        : ["admin", "manager", "analyst"]
      break
    case "storyboard":
      allowedRoles = ["admin", "manager"]
      break
  }

  return {
    assetId: asset.id,
    allowedRoles,
    allowedAffiliates: affiliates,
    isPublic: featured && type !== "storyboard",
  }
}

export function getAvailableVisualizations(assetType: string): string[] {
  const visuals: Record<string, string[]> = {
    kpi: ["Line Chart", "Bar Chart", "Area Chart", "Waterfall Chart"],
    layout: ["Dashboard", "Report", "Scorecard"],
    storyboard: ["Presentation", "Slide Deck", "Executive Summary"],
  }
  return visuals[assetType] || []
}

export function getCurrentUser(index: number): User {
  return MOCK_USERS[index]
}

export function getRoleBadge(role: UserRole): { label: string; color: string } {
  const perm = ROLE_PERMISSIONS[role]
  return { label: perm.label, color: perm.color }
}

export function getRolePermissions(role: string): string[] {
  const permissions: Record<string, string[]> = {
    admin: ["All assets", "All affiliates", "Manage permissions"],
    analyst: ["KPIs", "Layouts", "North America", "Europe"],
    manager: ["KPIs", "Layouts", "Storyboards", "All affiliates"],
    viewer: ["Featured KPIs", "Public Layouts", "North America only"],
  }
  return permissions[role] || ["Limited access"]
}
