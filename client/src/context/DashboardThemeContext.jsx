import { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "taskpilot:dashboard-theme";

const ThemeContext = createContext(null);

// Saved choice wins; otherwise follow the OS preference.
function initialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // storage unavailable (private mode etc.) — fall through
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const DashboardThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(initialTheme);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") }),
    [theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Outside the dashboard (no provider) everything is light.
// eslint-disable-next-line react-refresh/only-export-components
export const useDashboardTheme = () =>
  useContext(ThemeContext) ?? { theme: "light", setTheme: () => {}, toggle: () => {} };
