"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react"
import { Asset, ALL_ASSETS } from "./shared"
import { checkAssetAccess } from "@/data/permissions"
import { user } from "./shared"

interface ModalContextType {
  // Selected asset (umbrella state)
  selectedAsset: Asset | null
  setSelectedAsset: (asset: Asset | null) => void

  // Favorites
  favorites: Set<string>
  toggleFavorite: (asset: Asset) => void
  isFavorite: (asset: Asset) => boolean

  // Derived from selectedAsset
  showAddToLayout: boolean
  showVisualize: boolean
  shouldShowRequestAccess: boolean

  // Layout Builder
  showLayoutBuilder: boolean
  setShowLayoutBuilder: (open: boolean) => void
  selectedKpisForLayout: Asset[]
  setSelectedKpisForLayout: (kpis: Asset[]) => void
  addKpiToLayout: (asset: Asset) => void
  removeKpiFromLayout: (kpiId: string) => void
  layoutName: string
  setLayoutName: (name: string) => void
  layoutDescription: string
  setLayoutDescription: (desc: string) => void
  canBuildLayout: boolean
  availableVisuals: Record<string, string[]>
  handleBuildLayout: (name: string, description: string) => void

  // Visual Selector
  showVisualSelector: boolean
  setShowVisualSelector: (open: boolean) => void
  visualAsset: Asset | null
  setVisualAsset: (asset: Asset | null) => void
  selectedVisual: string | null
  setSelectedVisual: (visual: string | null) => void
  annotation: string
  setAnnotation: (annotation: string) => void
  annotations: Record<string, string>
  setAnnotations: (annotations: Record<string, string>) => void
  handleVisualSelect: (visual: string) => void
  handleSaveAnnotation: () => void
  handleApplyVisual: () => void
  visuals: string[]
  appliedVisual: { visual: string; annotation: string } | null
  setAppliedVisual: (
    visual: { visual: string; annotation: string } | null,
  ) => void

  // Request Access
  showRequestAccess: boolean
  setShowRequestAccess: (open: boolean) => void
  requestAccessAsset: Asset | null
  setRequestAccessAsset: (asset: Asset | null) => void
  reason: string
  setReason: (reason: string) => void
  isSubmitting: boolean
  submitStatus: "idle" | "success" | "error"
  errorMessage: string
  handleAccessSubmit: () => void
  hasAccess: boolean
  requiredRoles: string[]
}

const ModalContext = createContext<ModalContextType | null>(null)

export const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("Modal components must be used within ModalProvider")
  }
  return context
}

const ModalProvider = ({ children }: { children: ReactNode }) => {
  // Selected asset (umbrella state)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  // Favorites
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Layout Builder
  const [showLayoutBuilder, setShowLayoutBuilder] = useState(false)
  const [selectedKpisForLayout, setSelectedKpisForLayout] = useState<Asset[]>(
    [],
  )
  const [layoutName, setLayoutName] = useState("")
  const [layoutDescription, setLayoutDescription] = useState("")

  // Visual Selector
  const [showVisualSelector, setShowVisualSelector] = useState(false)
  const [visualAsset, setVisualAsset] = useState<Asset | null>(null)
  const [selectedVisual, setSelectedVisual] = useState<string | null>(null)
  const [annotation, setAnnotation] = useState("")
  const [annotations, setAnnotations] = useState<Record<string, string>>({})
  const [appliedVisual, setAppliedVisual] = useState<{
    visual: string
    annotation: string
  } | null>(null)

  // Request Access
  const [showRequestAccess, setShowRequestAccess] = useState(false)
  const [requestAccessAsset, setRequestAccessAsset] = useState<Asset | null>(
    null,
  )
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Computed values
  const accessCheck = selectedAsset
    ? checkAssetAccess(selectedAsset, user)
    : { hasAccess: true }
  const showAddToLayout = selectedAsset?.type === "kpi"
  const showVisualize = selectedAsset?.type === "kpi"
  const shouldShowRequestAccess =
    selectedAsset?.type === "storyboard" && !accessCheck.hasAccess
  const isFavorite = selectedAsset ? favorites.has(selectedAsset.id) : false
  const canBuildLayout =
    selectedKpisForLayout.length > 0 && layoutName.trim().length > 0

  const availableVisuals = useMemo(() => {
    const map: Record<string, string[]> = {}
    ALL_ASSETS.filter(a => a.type === "kpi").forEach(kpi => {
      map[kpi.id] = (kpi.details.visualAvailable as string[]) || []
    })
    return map
  }, [])

  const visuals = visualAsset
    ? (visualAsset.details.visualAvailable as string[]) || []
    : []

  const hasAccess = requestAccessAsset
    ? (
        (requestAccessAsset.details.applicableAffiliates as string[]) || []
      ).includes(user.role) || user.role === "admin"
    : false

  const requiredRoles = requestAccessAsset
    ? (requestAccessAsset.details.applicableAffiliates as string[]) || []
    : []

  // Handlers
  const toggleFavorite = useCallback((asset: Asset) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(asset.id)) {
        next.delete(asset.id)
      } else {
        next.add(asset.id)
      }
      return next
    })
  }, [])

  const addKpiToLayout = useCallback((asset: Asset) => {
    setSelectedKpisForLayout(prev => {
      if (prev.some(k => k.id === asset.id)) return prev
      return [...prev, asset]
    })
    setLayoutName("")
    setLayoutDescription("")
    setShowLayoutBuilder(true)
    setSelectedAsset(null)
  }, [])

  const removeKpiFromLayout = useCallback(
    (kpiId: string) => {
      setSelectedKpisForLayout(prev => prev.filter(k => k.id !== kpiId))
      if (selectedKpisForLayout.length === 1) {
        setShowLayoutBuilder(false)
      }
    },
    [selectedKpisForLayout.length],
  )

  const handleBuildLayout = useCallback(
    (name: string, description: string) => {
      console.log("Building layout:", {
        name,
        description,
        kpis: selectedKpisForLayout,
      })
      alert(
        `Layout "${name}" created with ${selectedKpisForLayout.length} KPIs!`,
      )
      setSelectedKpisForLayout([])
      setShowLayoutBuilder(false)
    },
    [selectedKpisForLayout],
  )

  const handleVisualSelect = useCallback(
    (visual: string) => {
      setSelectedVisual(visual)
      setAnnotation(annotations[visual] || "")
    },
    [annotations],
  )

  const handleSaveAnnotation = useCallback(() => {
    if (selectedVisual && annotation.trim()) {
      setAnnotations(prev => ({ ...prev, [selectedVisual]: annotation.trim() }))
    }
  }, [selectedVisual, annotation])

  const handleApplyVisual = useCallback(() => {
    if (selectedVisual) {
      alert(
        `Visual "${selectedVisual}" applied with annotation: "${annotations[selectedVisual]}"!`,
      )
      setAppliedVisual({
        visual: selectedVisual,
        annotation: annotations[selectedVisual] || "",
      })
      setShowVisualSelector(false)
      setVisualAsset(null)
      setSelectedVisual(null)
      setAnnotation("")
    }
  }, [selectedVisual, annotations])

  const handleAccessSubmit = useCallback(async () => {
    if (!reason.trim()) {
      setErrorMessage("Please provide a reason for requesting access")
      return
    }
    setIsSubmitting(true)
    setErrorMessage("")
    await new Promise(resolve => setTimeout(resolve, 1000))
    const success = Math.random() > 0.1
    if (success) {
      setSubmitStatus("success")
      if (requestAccessAsset) {
        // Access request submitted
      }
    } else {
      setSubmitStatus("error")
      setErrorMessage("Request could not be processed. Please try again later.")
    }
    setIsSubmitting(false)
  }, [reason, requestAccessAsset])

  const value: ModalContextType = {
    // Selected asset
    selectedAsset,
    setSelectedAsset,

    // Favorites
    favorites,
    toggleFavorite,
    isFavorite: (asset: Asset) => favorites.has(asset.id),

    // Derived from selectedAsset
    showAddToLayout,
    showVisualize,
    shouldShowRequestAccess,

    // Layout Builder
    showLayoutBuilder,
    setShowLayoutBuilder,
    selectedKpisForLayout,
    setSelectedKpisForLayout,
    addKpiToLayout,
    removeKpiFromLayout,
    layoutName,
    setLayoutName,
    layoutDescription,
    setLayoutDescription,
    canBuildLayout,
    availableVisuals,
    handleBuildLayout,

    // Visual Selector
    showVisualSelector,
    setShowVisualSelector,
    visualAsset,
    setVisualAsset,
    selectedVisual,
    setSelectedVisual,
    annotation,
    setAnnotation,
    annotations,
    setAnnotations,
    handleVisualSelect,
    handleSaveAnnotation,
    handleApplyVisual,
    visuals,
    appliedVisual,
    setAppliedVisual,

    // Request Access
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
  }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

export default ModalProvider
