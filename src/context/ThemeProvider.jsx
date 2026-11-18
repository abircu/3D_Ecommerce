import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './theme'

const THEME_KEY = 'aether-theme'

function readTheme() {
  const query = new URLSearchParams(window.location.search).get('theme')
  if (query === 'light' || query === 'dark') return query
  const current = document.documentElement.dataset.theme
  if (current === 'light' || current === 'dark') return current
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f4f0e6' : '#070708')
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggle() {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
