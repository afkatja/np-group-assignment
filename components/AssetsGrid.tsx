import { Asset } from "@/app/shared"
import { Card } from "./Card"

interface AssetGridProps {
  assets: Asset[]
  onAssetClick: (asset: Asset) => void
  renderCard: (asset: Asset) => React.ReactNode
  className?: string
  emptyMessage?: string
}

const AssetGrid = ({
  assets,
  onAssetClick,
  renderCard,
  className = "",
  emptyMessage = "No assets found",
}: AssetGridProps) => {
  if (assets.length === 0) {
    return (
      <div className={`col-span-full py-12 text-center ${className}`}>
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="mt-4 text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}
      role="list"
    >
      {assets.map(asset => (
        <Card key={asset.id} onClick={() => onAssetClick(asset)}>
          {renderCard(asset)}
        </Card>
      ))}
    </div>
  )
}

export default AssetGrid
