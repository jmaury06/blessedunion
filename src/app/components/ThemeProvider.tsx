"use client"

import { useEffect, useState } from "react"
import { useThemeStore } from "../store/useRaffleStore"

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme)
  const [mounted, setMounted] = useState(false)

  // Apply theme immediately on mount
  useEffect(() => {
    setMounted(true)
    
    // Apply initial theme
    const root = window.document.documentElement
    const storedTheme = localStorage.getItem("theme-storage")
    
    if (storedTheme) {
      try {
        const parsed = JSON.parse(storedTheme)
        const initialTheme = parsed.state?.theme || "light"
        root.classList.remove("light", "dark")
        root.classList.add(initialTheme)
      } catch (e) {
        root.classList.add("light")
      }
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.add(prefersDark ? "dark" : "light")
    }
  }, [])

  // Update theme when it changes
  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme)
    }
  }, [theme, mounted])

  return <>{children}</>
}
