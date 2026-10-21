"use client"

import { useState, useRef, useEffect } from "react"
import { SearchIcon, CloseIcon } from "./Icons"
import Input from "./Input"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  onClear?: () => void
  placeholder?: string
  recentSearches?: string[]
  className?: string
}

const SearchInput = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Search assets...",
  recentSearches = [],
  className = "",
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value)
    }
    if (e.key === "Escape") {
      setShowDropdown(false)
      inputRef.current?.blur()
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (recentSearches.length > 0) {
      setShowDropdown(true)
    }
  }

  const handleClear = () => {
    onChange("")
    onClear?.()
    setShowDropdown(false)
  }

  const handleRecentClick = (search: string) => {
    onChange(search)
    onSearch?.(search)
    setShowDropdown(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 text-gray-900 bg-white border border-gray-300 focus:outline-none  focus:border-gray-400 rounded-lg placeholder:text-gray-400 transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {showDropdown && (isFocused || value) && (
        <div
          id="search-suggestions"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          role="listbox"
        >
          {recentSearches.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Recent Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRecentClick(search)}
                    className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    role="option"
                    aria-selected="false"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
          {recentSearches.length === 0 && !value && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No recent searches
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchInput
