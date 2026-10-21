"use client"

import { useState, createContext, useContext, ReactNode } from "react"

interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within Tabs.Root")
  }
  return context
}

interface TabsRootProps {
  defaultValue: string
  value?: string
  onChange?: (value: string) => void
  children: ReactNode
  className?: string
}

export const TabsRoot = ({
  defaultValue,
  value: controlledValue,
  onChange,
  children,
  className = "",
}: TabsRootProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const activeTab = isControlled ? controlledValue : uncontrolledValue

  const setActiveTab = (tab: string) => {
    if (!isControlled) {
      setUncontrolledValue(tab)
    }
    onChange?.(tab)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
  "aria-label"?: string
}

export const TabsList = ({
  children,
  className = "",
  "aria-label": ariaLabel,
}: TabsListProps) => (
  <div
    role="tablist"
    aria-label={ariaLabel}
    className={`flex gap-1 justify-center max-w-2xl mx-auto bg-gray-200 rounded-xl p-2 ${className}`}
  >
    {children}
  </div>
)

interface TabsTriggerProps {
  value: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

export const TabsTrigger = ({
  value,
  children,
  disabled = false,
  className = "",
}: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === value

  const baseStyles =
    "rounded-xl flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap "

  const variantStyles = isActive
    ? "text-gray-900 bg-gray-100"
    : "text-gray-400 hover:text-gray-900 hover:border-gray-300 hover:cursor-pointer"

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => !disabled && setActiveTab(value)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          !disabled && setActiveTab(value)
        }
      }}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsContent = ({
  value,
  children,
  className = "",
}: TabsContentProps) => {
  const { activeTab } = useTabsContext()
  const isActive = activeTab === value

  if (!isActive) return null

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={`mt-4 animate-fade-in ${className}`}
    >
      {children}
    </div>
  )
}

const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
}

export default Tabs
