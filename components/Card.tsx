"use client"

interface CardProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
  onKeyDown?: (e: React.KeyboardEvent) => void
}

export const Card = ({
  children,
  onClick,
  className = "",
  onKeyDown,
}: CardProps) => (
  <article
    className={`group relative bg-white rounded-md p-5 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300 cursor-pointer ${className}`}
    onClick={onClick}
    onKeyDown={e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onClick()
      }
      onKeyDown?.(e)
    }}
    tabIndex={0}
    role="button"
  >
    {children}
  </article>
)
