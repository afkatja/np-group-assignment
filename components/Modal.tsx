"use client"

import { useEffect, useRef, createContext, useContext, ReactNode } from "react"
import Button from "./Button"
import { CloseIcon } from "./Icons"

type ModalSize = "default" | "lg" | "xl" | "full" | "side"

interface ModalContextType {
  isOpen: boolean
  onClose: () => void
  size: ModalSize
}

const ModalContext = createContext<ModalContextType | null>(null)

const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("Modal components must be used within Modal.Root")
  }
  return context
}

interface ModalRootProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  size?: ModalSize
}

export const ModalRoot = ({
  isOpen,
  onClose,
  children,
  size = "default",
}: ModalRootProps) => {
  return (
    <ModalContext.Provider value={{ isOpen, onClose, size }}>
      <ModalPortal>{children}</ModalPortal>
    </ModalContext.Provider>
  )
}

const ModalPortal = ({ children }: { children: ReactNode }) => {
  const { isOpen, onClose, size } = useModal()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeStyles = {
    default: "w-full max-w-3xl",
    lg: "w-full max-w-4xl",
    xl: "w-full max-w-5xl",
    full: "w-full max-w-7xl",
    side: "w-full md:w-96 lg:w-112",
  }

  const alignmentStyles = {
    default: "items-center justify-center",
    lg: "items-center justify-center",
    xl: "items-center justify-center",
    full: "items-center justify-center",
    side: "items-end md:items-center justify-end md:justify-center",
  }

  const borderRadiusStyles = {
    default: "rounded-2xl",
    lg: "rounded-2xl",
    xl: "rounded-2xl",
    full: "rounded-2xl",
    side: "rounded-t-2xl md:rounded-2xl",
  }

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex ${alignmentStyles[size]} p-4 bg-black/50 backdrop-blur-sm animate-fade-in`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative ${sizeStyles[size]} max-h-[90vh] overflow-hidden bg-white ${borderRadiusStyles[size]} shadow-xl animate-slide-up md:animate-fade-in flex flex-col p-8`}
      >
        {children}
      </div>
    </div>
  )
}

interface ModalHeaderProps {
  title: string
  type?: { color: string; label: string }
  description?: string
  className?: string
}

export const ModalHeader = ({
  title,
  type,
  description,
  className = "",
}: ModalHeaderProps) => {
  return (
    <header className={`p-4 ${className}`}>
      <div className="flex items-center justify-center gap-3 my-4">
        <h2 id="modal-title" className="text-3xl font-semibold text-gray-900">
          {title}
        </h2>
        {type && (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700`}
          >
            {type.label}
          </span>
        )}
      </div>
      <div className="prose max-w-none mb-6 flex justify-center my-4">
        <p className="text-gray-500">{description}</p>
      </div>
    </header>
  )
}

interface ModalCloseButtonProps {
  className?: string
  "aria-label"?: string
}

export const ModalCloseButton = ({
  className = "",
  "aria-label": ariaLabel = "Close modal",
}: ModalCloseButtonProps) => {
  const { onClose } = useModal()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 ${className}`}
      onClick={onClose}
      aria-label={ariaLabel}
    >
      <CloseIcon className="h-5 w-5" />
    </Button>
  )
}

interface ModalContentProps {
  children: ReactNode
  className?: string
}

export const ModalContent = ({
  children,
  className = "",
}: ModalContentProps) => {
  return (
    <div
      className={`p-4 overflow-y-auto max-h-[calc(90vh-140px)] ${className}`}
    >
      {children}
    </div>
  )
}

interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export const ModalFooter = ({ children, className = "" }: ModalFooterProps) => {
  return (
    <footer className={`flex items-center justify-end gap-3 p-4 ${className}`}>
      {children}
    </footer>
  )
}

const Modal = {
  Root: ModalRoot,
  Header: ModalHeader,
  CloseButton: ModalCloseButton,
  Content: ModalContent,
  Footer: ModalFooter,
}

export default Modal
