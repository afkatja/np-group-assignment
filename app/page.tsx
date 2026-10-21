"use client"

import { useState, useCallback, useMemo } from "react"
import Tabs from "@/components/Tabs"
import SearchInput from "@/components/SearchInput"
import Button from "@/components/Button"
import AssetGrid from "../components/AssetsGrid"
import {
  KpiIcon,
  LayoutDashboardIcon,
  StoryboardIcon,
} from "@/components/Icons"
import LayoutBuilderModal from "./LayoutBuilderModal"
import { ALL_ASSETS, Asset, RECENT_SEARCHES, user } from "./shared"
import VisualSelectorModal from "./VisualSelectorModal"
import RequestAccessModal from "./RequestAccessModal"
import MainAssetModal from "./MainAssetModal"
import ModalProvider, { useModalContext } from "./ModalProvider"

type TabValue = "featured" | "kpi" | "layout" | "storyboard"

const typeIcons = {
  kpi: <KpiIcon className="h-4 w-4" />,
  layout: <LayoutDashboardIcon className="h-4 w-4" />,
  storyboard: <StoryboardIcon className="h-4 w-4" />,
}

const LibraryPageContent = () => {
  const { setSelectedAsset } = useModalContext()

  const [activeTab, setActiveTab] = useState<TabValue>("featured")
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as TabValue)
  }, [])
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilteredView, setShowFilteredView] = useState(false)
  const [showMore, setShowMore] = useState<Record<string, boolean>>({
    featured: false,
    kpi: false,
    layout: false,
    storyboard: false,
  })
  const [recentSearches, setRecentSearches] =
    useState<string[]>(RECENT_SEARCHES)

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (query.trim()) {
        setShowFilteredView(true)
        const newRecent = [
          query,
          ...recentSearches.filter(s => s !== query),
        ].slice(0, 5)
        setRecentSearches(newRecent)
      } else {
        setShowFilteredView(false)
      }
    },
    [recentSearches],
  )

  const handleClearSearch = useCallback(() => {
    setSearchQuery("")
    setShowFilteredView(false)
  }, [])

  const handleRecentSearchClick = useCallback((search: string) => {
    setSearchQuery(search)
    setShowFilteredView(true)
  }, [])

  const filteredAssets = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return ALL_ASSETS.filter(
      asset =>
        asset.name.toLowerCase().includes(query) ||
        asset.description.toLowerCase().includes(query) ||
        (Array.isArray(asset.category)
          ? asset.category.some(c => c.toLowerCase().includes(query))
          : (asset.category?.toLowerCase().includes(query) ?? false)) ||
        asset.date.includes(query),
    )
  }, [searchQuery])

  const tabAssets = useMemo(() => {
    if (showFilteredView) return filteredAssets

    const typeMap: Record<string, "kpi" | "layout" | "storyboard"> = {
      featured: "kpi",
      kpi: "kpi",
      layout: "layout",
      storyboard: "storyboard",
    }

    const type = typeMap[activeTab]
    let assets = ALL_ASSETS.filter(a => a.type === type)

    if (activeTab === "featured") {
      assets = ALL_ASSETS.filter(a => a.featured)
    }

    return assets
  }, [activeTab, showFilteredView, filteredAssets])

  const displayedAssets = useMemo(() => {
    const showMoreActive = showMore[activeTab]
    return showMoreActive ? tabAssets : tabAssets.slice(0, 4)
  }, [tabAssets, activeTab, showMore])

  const hasMoreAssets = tabAssets.length > 4 && !showMore[activeTab]

  const getEmptyMessage = useCallback(() => {
    if (showFilteredView && filteredAssets.length === 0) {
      return "Not seeing what you are looking for? Try another search."
    }
    return "No featured assets available"
  }, [showFilteredView, filteredAssets])

  const renderAssetCard = (asset: Asset) => {
    const formattedDate = new Date(asset.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    const categoryDisplay = Array.isArray(asset.category)
      ? asset.category.join(", ")
      : asset.category

    return (
      <div className="flex">
        <div className="relative aspect-video overflow-hidden bg-gray-100 rounded-sm flex-1">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            {typeIcons[asset.type]}
          </div>
        </div>

        <div className="px-4 flex-3">
          <div className="flex items-center gap-2 mb-2">
            {typeIcons[asset.type]}
            <span className="text-xs font-medium text-gray-500 capitalize">
              {categoryDisplay}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors">
            {asset.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {asset.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <time dateTime={asset.date}>{formattedDate}</time>
            <span className="hidden sm:inline">Click to view details</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Library</h1>
              <p className="mt-1 text-gray-600">
                Browse for assets needed to report and present analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-700">
                {user.name} ({user.role})
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8 mx-auto max-w-2xl">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Type to search..."
            recentSearches={recentSearches}
          />
        </div>

        {showFilteredView && searchQuery && (
          <div className="mb-6 p-4 bg-gray-100 border border-gray-200 rounded-lg mx-auto max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Search results for &quot;{searchQuery}&quot;
                </p>
                {filteredAssets.length === 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Not seeing what you are looking for? Try another search.
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                Clear search
              </Button>
            </div>
            {recentSearches.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                  Recent Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Tabs.Root
          defaultValue="featured"
          onChange={handleTabChange}
          className="mb-6 max-w-7xl mx-auto"
        >
          {!showFilteredView && (
            <Tabs.List aria-label="Asset types">
              <Tabs.Trigger value="featured">Featured</Tabs.Trigger>
              <Tabs.Trigger value="kpi">KPI</Tabs.Trigger>
              <Tabs.Trigger value="layout">Layouts</Tabs.Trigger>
              <Tabs.Trigger value="storyboard">Storyboards</Tabs.Trigger>
            </Tabs.List>
          )}

          <Tabs.Content value="featured">
            <AssetGrid
              assets={displayedAssets}
              onAssetClick={setSelectedAsset}
              renderCard={asset => renderAssetCard(asset)}
              emptyMessage={getEmptyMessage()}
            />
            {hasMoreAssets && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() =>
                    setShowMore(prev => ({ ...prev, featured: true }))
                  }
                >
                  Show more assets
                </Button>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="kpi">
            <AssetGrid
              assets={displayedAssets}
              onAssetClick={setSelectedAsset}
              renderCard={asset => renderAssetCard(asset)}
              emptyMessage="No KPI assets available"
            />
            {hasMoreAssets && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowMore(prev => ({ ...prev, kpi: true }))}
                >
                  Show more assets
                </Button>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="layout">
            <AssetGrid
              assets={displayedAssets}
              onAssetClick={setSelectedAsset}
              renderCard={asset => renderAssetCard(asset)}
              emptyMessage="No layout assets available"
            />
            {hasMoreAssets && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() =>
                    setShowMore(prev => ({ ...prev, layout: true }))
                  }
                >
                  Show more assets
                </Button>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="storyboard">
            <AssetGrid
              assets={displayedAssets}
              onAssetClick={setSelectedAsset}
              renderCard={asset => renderAssetCard(asset)}
              emptyMessage="No storyboard assets available"
            />
            {hasMoreAssets && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() =>
                    setShowMore(prev => ({ ...prev, storyboard: true }))
                  }
                >
                  Show more assets
                </Button>
              </div>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </main>

      <MainAssetModal />
      <LayoutBuilderModal />
      <VisualSelectorModal />
      <RequestAccessModal />
    </div>
  )
}

export default function LibraryPage() {
  return (
    <ModalProvider>
      <LibraryPageContent />
    </ModalProvider>
  )
}
