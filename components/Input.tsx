import { JSX, useState, useId } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  placeholder?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  helperText?: string
  fullWidth?: boolean
  [prop: string]: any
}

const Input = ({
  label,
  placeholder,
  leftIcon,
  rightIcon,
  error,
  helperText,
  fullWidth = false,
  className = "",
  id,
  ...props
}: InputProps): JSX.Element => {
  const generatedId = useId()
  const inputId = id || generatedId
  const [isFocused, setIsFocused] = useState(false)

  const baseStyles = `
    w-full px-4 py-2.5 text-gray-900 bg-white border rounded-lg
    placeholder:text-gray-400
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
  `

  const focusStyles = isFocused
    ? "ring-gray-500 border-gray-500"
    : error
      ? "ring-gray-500 border-gray-500"
      : "ring-transparent border-gray-300 hover:border-gray-400"

  const iconStyles =
    "absolute inset-y-0 flex items-center pointer-events-none text-gray-400"

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && <div className={`${iconStyles} left-3`}>{leftIcon}</div>}
        <input
          id={inputId}
          placeholder={placeholder}
          className={`${baseStyles} ${focusStyles} ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {rightIcon && (
          <div className={`${iconStyles} right-3`}>{rightIcon}</div>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-gray-700"
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}
export default Input
