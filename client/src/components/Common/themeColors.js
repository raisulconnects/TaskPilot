// Raw colour values for things that can't read CSS variables: Recharts SVG
// attributes and SweetAlert2 popups (rendered outside the dashboard root).

export const CHART_COLORS = {
  light: { grid: "#e6e7ea", tick: "#535768", tickMuted: "#808080", surface: "#ffffff", border: "#dddfeb", text: "#333333" },
  dark: { grid: "#2b2e3a", tick: "#b3b6c6", tickMuted: "#858899", surface: "#181a22", border: "#2b2e3a", text: "#ededf3" },
};

export function swalTheme(theme) {
  return theme === "dark" ? { background: "#181a22", color: "#ededf3" } : {};
}
