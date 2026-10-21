"use client"

import Modal from "../components/Modal"
import Button from "../components/Button"
import { CheckIcon, ExternalLinkIcon } from "../components/Icons"
import { user } from "./shared"
import { useModalContext } from "./ModalProvider"

const RequestAccessModal = () => {
  const {
    showRequestAccess,
    setShowRequestAccess,
    requestAccessAsset,
    setRequestAccessAsset,
    reason,
    setReason,
    isSubmitting,
    submitStatus,
    errorMessage,
    handleAccessSubmit,
    hasAccess,
    requiredRoles,
  } = useModalContext()

  const handleClose = () => {
    setShowRequestAccess(false)
    setRequestAccessAsset(null)
  }

  return (
    <Modal.Root isOpen={showRequestAccess} onClose={handleClose}>
      {requestAccessAsset && (
        <>
          {submitStatus === "success" ? (
            <>
              <Modal.Header title="Request Submitted" />
              <Modal.Content>
                <div className="text-center py-6">
                  <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <CheckIcon className="h-8 w-8 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Request Submitted
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your access request for{" "}
                    <strong>{requestAccessAsset.name}</strong> has been
                    submitted successfully. The content owner will review your
                    request and get back to you.
                  </p>
                </div>
              </Modal.Content>
              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={handleClose}
                  className="w-full"
                >
                  Done
                </Button>
              </Modal.Footer>
            </>
          ) : (
            <>
              <Modal.Header title="Request Access" />
              <Modal.CloseButton />
              <Modal.Content>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                      Your Role: {user.role}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Asset: {requestAccessAsset.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Type: {requestAccessAsset.type}
                    </p>
                  </div>
                </div>

                {hasAccess ? (
                  <div className="mb-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckIcon className="h-5 w-5 text-gray-700 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          You already have access
                        </p>
                        <p className="text-sm text-gray-600">
                          Your role ({user.role}) has permission to view this
                          asset.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ExternalLinkIcon className="h-5 w-5 text-gray-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Access Required
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          This asset requires specific permissions. Your current
                          role ({user.role}) does not have access. Required
                          roles: {requiredRoles.join(", ") || "Admin only"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label
                    htmlFor="access-reason"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Reason for Request *
                  </label>
                  <textarea
                    id="access-reason"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Explain why you need access to this asset and how you plan to use it..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    disabled={submitStatus !== "idle" || hasAccess}
                  />
                  {errorMessage && (
                    <p className="mt-2 text-sm text-gray-700" role="alert">
                      {errorMessage}
                    </p>
                  )}
                </div>
              </Modal.Content>
              <Modal.Footer>
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAccessSubmit}
                    disabled={
                      isSubmitting ||
                      !reason.trim() ||
                      reason.length < 10 ||
                      hasAccess
                    }
                    className="flex-1"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </Modal.Footer>
            </>
          )}
        </>
      )}
    </Modal.Root>
  )
}

export default RequestAccessModal
