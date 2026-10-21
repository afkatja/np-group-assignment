"use client"

import Modal from "../components/Modal"
import { KpiIcon, PlaceholderIcon, RemoveIcon } from "../components/Icons"
import Button from "../components/Button"
import { useModalContext } from "./ModalProvider"

const LayoutBuilderModal = () => {
  const {
    showLayoutBuilder,
    setShowLayoutBuilder,
    selectedKpisForLayout,
    layoutName,
    layoutDescription,
    canBuildLayout,
    availableVisuals,
    setLayoutName,
    setLayoutDescription,
    removeKpiFromLayout,
    handleBuildLayout,
  } = useModalContext()

  return (
    <Modal.Root
      isOpen={showLayoutBuilder}
      onClose={() => setShowLayoutBuilder(false)}
      size="side"
    >
      <>
        <Modal.Header title="Layout Builder" />
        <Modal.CloseButton />
        <Modal.Content>
          {selectedKpisForLayout.length === 0 ? (
            <div className="text-center py-12">
              <PlaceholderIcon
                className="mx-auto h-12 w-12 text-gray-400"
                size={48}
              />
              <p className="mt-4 text-gray-500">No KPIs selected</p>
              <p className="mt-2 text-sm text-gray-400">
                Select KPIs from the library to add them here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-900">
                Selected KPIs ({selectedKpisForLayout.length})
              </p>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedKpisForLayout.map(asset => (
                  <div
                    key={asset.id}
                    className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg border border-gray-200"
                  >
                    <div className="shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <KpiIcon className="h-5 w-5 text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {asset.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {asset.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {availableVisuals[asset.id]?.map((visual, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full"
                          >
                            {visual}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 p-1"
                      onClick={() => removeKpiFromLayout(asset.id)}
                      aria-label={`Remove ${asset.name} from layout`}
                    >
                      <RemoveIcon size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-medium text-gray-900 mb-4">
                  Layout Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="layout-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Layout Name *
                    </label>
                    <input
                      id="layout-name"
                      type="text"
                      value={layoutName}
                      onChange={e => setLayoutName(e.target.value)}
                      placeholder="e.g. dashboard"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="layout-description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="layout-description"
                      value={layoutDescription}
                      onChange={e => setLayoutDescription(e.target.value)}
                      placeholder="Describe what this layout will show..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Content>
        <Modal.Footer>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setShowLayoutBuilder(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleBuildLayout(layoutName, layoutDescription)}
              disabled={!canBuildLayout}
              className="flex-1"
            >
              Build Layout
            </Button>
          </div>
          {selectedKpisForLayout.length > 0 && !canBuildLayout && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Please enter a layout name to continue
            </p>
          )}
        </Modal.Footer>
      </>
    </Modal.Root>
  )
}

export default LayoutBuilderModal
