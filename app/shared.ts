import { getCurrentUser, MOCK_USERS } from "../data/permissions"
import assetsData from "@/data/assets.json"

export interface Asset {
  id: string
  type: "kpi" | "layout" | "storyboard"
  name: string
  description: string
  date: string
  image: string
  category?: string | string[]
  featured: boolean
  details: Record<string, unknown>
  layoutType?: string
  used?: number
}
export type AssetType = "kpi" | "layout" | "storyboard"

export interface AssetsData {
  assets: Asset[]
  recentSearches: string[]
}

const typedAssetsData = assetsData as AssetsData
export const ALL_ASSETS: Asset[] = typedAssetsData.assets
export const RECENT_SEARCHES: string[] = typedAssetsData.recentSearches

export const user = getCurrentUser(
  Math.floor(Math.random() * MOCK_USERS.length),
)
