"use client"

import { LoadingIcon } from "./Icons"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"

  const variantStyles = {
    primary: "bg-gray-700 text-gray-200 hover:bg-gray-800 focus:ring-gray-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    danger: "bg-gray-700 text-gray-200 hover:bg-gray-800 focus:ring-gray-500",
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2",
  }

  const widthStyles = fullWidth ? "w-full" : ""

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <LoadingIcon className="animate-spin" size={16} />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
}

const IconButton = ({
  children,
  variant = "ghost",
  size = "md",
  className = "",
  ...props
}: Omit<ButtonProps, "leftIcon" | "rightIcon" | "fullWidth">) => {
  const sizeStyles = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}
export default Button
export { IconButton }
