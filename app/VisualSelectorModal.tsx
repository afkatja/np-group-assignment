"use client"

import Modal from "../components/Modal"
import { CheckIcon, PlaceholderIcon } from "../components/Icons"
import Button from "../components/Button"
import { useModalContext } from "./ModalProvider"

const VisualSelectorModal = () => {
  const {
    showVisualSelector,
    setShowVisualSelector,
    visualAsset,
    selectedVisual,
    annotation,
    setAnnotation,
    annotations,
    visuals,
    handleVisualSelect,
    handleSaveAnnotation,
    handleApplyVisual,
  } = useModalContext()

  return (
    <Modal.Root
      isOpen={showVisualSelector}
      onClose={() => setShowVisualSelector(false)}
    >
      {visualAsset && (
        <>
          <Modal.Header
            title={visualAsset.name}
            type={{ color: "bg-gray-200 text-gray-700", label: "KPI" }}
          />
          <Modal.CloseButton />
          <Modal.Content>
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Select a visualization type
              </p>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                role="radiogroup"
                aria-label="Chart types"
              >
                {visuals.map(visual => {
                  const Icon = <PlaceholderIcon className="h-6 w-6" />

                  const isSelected = selectedVisual === visual
                  return (
                    <button
                      key={visual}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleVisualSelect(visual)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-gray-700 bg-gray-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <div
                          className={`p-3 rounded-lg ${isSelected ? "bg-gray-200" : "bg-gray-100"}`}
                        >
                          {Icon}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-center text-gray-900">
                        {visual}
                      </p>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckIcon className="h-5 w-5 text-gray-700" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedVisual && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">
                    Annotation for {selectedVisual}
                  </h3>
                  {annotations[selectedVisual] && (
                    <span className="text-xs text-gray-700">Saved</span>
                  )}
                </div>
                <div className="space-y-3">
                  <textarea
                    value={annotation}
                    onChange={e => setAnnotation(e.target.value)}
                    placeholder="Add your insights, observations, or notes about this visualization..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSaveAnnotation}
                      disabled={!annotation.trim()}
                    >
                      Save Annotation
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setAnnotation("")}
                    >
                      Clear
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Annotations are saved per visualization and will be included
                    when you apply this visual.
                  </p>
                </div>
              </div>
            )}
          </Modal.Content>
          <Modal.Footer>
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => setShowVisualSelector(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleApplyVisual}
                disabled={!selectedVisual}
                className="flex-1"
              >
                Apply Visualization
              </Button>
            </div>
            {!selectedVisual && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Select a visualization type to continue
              </p>
            )}
          </Modal.Footer>
        </>
      )}
    </Modal.Root>
  )
}

export default VisualSelectorModal
