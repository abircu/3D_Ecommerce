import { useTheme } from '../context/theme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const light = theme === 'light'

  return (
    <button
      type="button"
      className={`theme-btn ${light ? 'is-light' : ''}`}
      aria-pressed={light}
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      data-cursor="theme"
      onClick={toggle}
    >
      <span className="theme-orb" />
    </button>
  )
}
