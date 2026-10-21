"use client"

import Button from "../components/Button"
import Modal from "../components/Modal"
import { checkAssetAccess, getCurrentUser } from "@/data/permissions"
import { AddIcon, ExternalLinkIcon, FavoriteIcon } from "../components/Icons"
import { useModalContext } from "./ModalProvider"

const typeLabels = {
  kpi: "KPI",
  layout: "Layout",
  storyboard: "Storyboard",
}

const MainAssetModal = () => {
  const {
    selectedAsset,
    setSelectedAsset,
    toggleFavorite,
    isFavorite,
    showAddToLayout,
    showVisualize,
    shouldShowRequestAccess,
    addKpiToLayout,
    setVisualAsset,
    setShowVisualSelector,
    setRequestAccessAsset,
    setShowRequestAccess,
  } = useModalContext()

  const accessCheck = selectedAsset
    ? checkAssetAccess(selectedAsset, getCurrentUser(0))
    : { hasAccess: true }

  const handleClose = () => {
    setSelectedAsset(null)
  }

  const handleAddToLayoutClick = () => {
    if (selectedAsset) {
      addKpiToLayout(selectedAsset)
    }
  }

  const handleVisualizeClick = () => {
    if (selectedAsset) {
      setVisualAsset(selectedAsset)
      setShowVisualSelector(true)
    }
  }

  const handleRequestAccessClick = () => {
    if (selectedAsset) {
      setRequestAccessAsset(selectedAsset)
      setShowRequestAccess(true)
    }
  }

  return (
    <Modal.Root isOpen={!!selectedAsset} onClose={handleClose}>
      {selectedAsset && (
        <>
          <Modal.Header
            title={selectedAsset.name}
            type={{
              color: "bg-gray-200 text-gray-700",
              label: typeLabels[selectedAsset.type],
            }}
            description={selectedAsset.description}
          />
          <Modal.CloseButton />
          <Modal.Content>
            {Array.isArray(selectedAsset.category) &&
              selectedAsset.category.length > 0 && (
                <div className="my-4 flex items-center justify-center gap-2">
                  {selectedAsset.category.map(category => (
                    <p
                      key={category}
                      className="text-sm text-gray-500 mb-1 rounded-xl bg-gray-100 px-2 py-1"
                    >
                      # {category}
                    </p>
                  ))}
                </div>
              )}

            {selectedAsset.type === "kpi" && selectedAsset.details && (
              <KpiModalDetails
                asset={selectedAsset}
                details={selectedAsset.details as unknown as KpiDetails}
              />
            )}

            {selectedAsset.type === "layout" && selectedAsset.details && (
              <LayoutModalDetails
                details={selectedAsset.details as unknown as LayoutDetails}
              />
            )}

            {selectedAsset.type === "storyboard" && selectedAsset.details && (
              <StoryboardModalDetails
                details={selectedAsset.details as unknown as StoryboardDetails}
              />
            )}

            {!accessCheck.hasAccess && selectedAsset.type !== "storyboard" && (
              <div className="mb-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <ExternalLinkIcon className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Limited Access</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {accessCheck.reason ||
                        "Your role may have limited access to this asset."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Modal.Content>
          <Modal.Footer>
            <Button
              variant={isFavorite(selectedAsset) ? "secondary" : "primary"}
              size="sm"
              onClick={() => toggleFavorite(selectedAsset)}
              leftIcon={
                <FavoriteIcon size={16} filled={isFavorite(selectedAsset)} />
              }
            >
              {isFavorite(selectedAsset)
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </Button>
            {showAddToLayout && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<AddIcon size={16} />}
                onClick={handleAddToLayoutClick}
              >
                Add to Layout
              </Button>
            )}
            {showVisualize && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<ExternalLinkIcon size={16} />}
                onClick={handleVisualizeClick}
              >
                Visualize
              </Button>
            )}
            {shouldShowRequestAccess && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ExternalLinkIcon size={16} />}
                onClick={handleRequestAccessClick}
              >
                Request Access
              </Button>
            )}
          </Modal.Footer>
        </>
      )}
    </Modal.Root>
  )
}

// Import detail components
import KpiModalDetails, { KpiDetails } from "./KpiDetails"
import LayoutModalDetails, { LayoutDetails } from "./LayoutDetails"
import StoryboardModalDetails, { StoryboardDetails } from "./StoryboardDetails"

export default MainAssetModal
