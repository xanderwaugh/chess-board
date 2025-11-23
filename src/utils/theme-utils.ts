/**
 * Theme utilities for chess board styling
 */

export type BoardTheme = "default" | "wood" | "marble" | "neon";

export interface BoardColors {
  light: string;
  dark: string;
  highlight: string;
  selected: string;
  lastMove: string;
  check: string;
  validMove: string;
  validMoveCapture: string;
}

/**
 * Board theme definitions
 */
export const BOARD_THEMES: Record<BoardTheme, BoardColors> = {
  default: {
    light: "bg-zinc-200 dark:bg-zinc-700",
    dark: "bg-zinc-400 dark:bg-zinc-900",
    highlight: "bg-yellow-300/50 dark:bg-yellow-500/30",
    selected: "bg-blue-400/60 dark:bg-blue-600/50",
    lastMove: "bg-yellow-400/40 dark:bg-yellow-600/30",
    check: "bg-red-500/50 dark:bg-red-700/50",
    validMove: "bg-green-400/40 dark:bg-green-600/30",
    validMoveCapture: "bg-red-400/40 dark:bg-red-600/30",
  },
  wood: {
    light: "bg-amber-100 dark:bg-amber-200",
    dark: "bg-amber-700 dark:bg-amber-900",
    highlight: "bg-yellow-300/50 dark:bg-yellow-500/40",
    selected: "bg-blue-400/50 dark:bg-blue-600/40",
    lastMove: "bg-yellow-500/30 dark:bg-yellow-700/30",
    check: "bg-red-500/60 dark:bg-red-700/50",
    validMove: "bg-green-400/50 dark:bg-green-600/40",
    validMoveCapture: "bg-red-400/50 dark:bg-red-600/40",
  },
  marble: {
    light: "bg-slate-50 dark:bg-slate-200",
    dark: "bg-slate-700 dark:bg-slate-900",
    highlight: "bg-cyan-300/50 dark:bg-cyan-500/40",
    selected: "bg-indigo-400/60 dark:bg-indigo-600/50",
    lastMove: "bg-cyan-400/40 dark:bg-cyan-600/30",
    check: "bg-pink-500/60 dark:bg-pink-700/50",
    validMove: "bg-teal-400/50 dark:bg-teal-600/40",
    validMoveCapture: "bg-rose-400/50 dark:bg-rose-600/40",
  },
  neon: {
    light: "bg-purple-900 dark:bg-purple-950",
    dark: "bg-pink-900 dark:bg-pink-950",
    highlight: "bg-cyan-400/60 dark:bg-cyan-500/50",
    selected: "bg-fuchsia-500/70 dark:bg-fuchsia-600/60",
    lastMove: "bg-cyan-500/50 dark:bg-cyan-600/40",
    check: "bg-red-500/70 dark:bg-red-600/60",
    validMove: "bg-green-400/60 dark:bg-green-500/50",
    validMoveCapture: "bg-red-400/60 dark:bg-red-500/50",
  },
};

/**
 * Get theme colors
 */
export function getThemeColors(theme: BoardTheme): BoardColors {
  return BOARD_THEMES[theme] || BOARD_THEMES.default;
}

/**
 * Get square color classes based on square position and theme
 */
export function getSquareColorClasses(
  isLight: boolean,
  theme: BoardTheme,
): string {
  const colors = getThemeColors(theme);
  return isLight ? colors.light : colors.dark;
}

/**
 * Get highlight color class
 */
export function getHighlightClass(
  type: "selected" | "valid" | "lastMove" | "check" | "validCapture",
  theme: BoardTheme,
): string {
  const colors = getThemeColors(theme);
  switch (type) {
    case "selected":
      return colors.selected;
    case "valid":
      return colors.validMove;
    case "lastMove":
      return colors.lastMove;
    case "check":
      return colors.check;
    case "validCapture":
      return colors.validMoveCapture;
    default:
      return "";
  }
}

/**
 * Get all available themes
 */
export function getAllThemes(): BoardTheme[] {
  return Object.keys(BOARD_THEMES) as BoardTheme[];
}

/**
 * Get theme display name
 */
export function getThemeDisplayName(theme: BoardTheme): string {
  const names: Record<BoardTheme, string> = {
    default: "Default",
    wood: "Classic Wood",
    marble: "Marble",
    neon: "Neon",
  };
  return names[theme] || "Default";
}

/**
 * Coordinate label styling
 */
export function getCoordinateLabelClasses(theme: BoardTheme): string {
  const isDark = theme === "neon";
  return isDark
    ? "text-cyan-300 font-semibold"
    : "text-zinc-700 dark:text-zinc-300 font-medium";
}

/**
 * Get board border classes
 */
export function getBoardBorderClasses(theme: BoardTheme): string {
  const borders: Record<BoardTheme, string> = {
    default: "border-2 border-zinc-800 dark:border-zinc-200",
    wood: "border-4 border-amber-800 dark:border-amber-950",
    marble: "border-2 border-slate-800 dark:border-slate-200",
    neon: "border-2 border-cyan-400 shadow-lg shadow-cyan-500/50",
  };
  return borders[theme] || borders.default;
}
