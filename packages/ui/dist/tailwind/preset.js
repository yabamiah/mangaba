// src/tailwind/preset.ts
import { fontFamily } from "tailwindcss/defaultTheme";
function withOpacity(varName) {
  return ({ opacityValue }) => {
    if (opacityValue === void 0) return `var(${varName})`;
    return `color-mix(in srgb, var(${varName}) calc(${opacityValue} * 100%), transparent)`;
  };
}
var preset = {
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: {
          DEFAULT: withOpacity("--border"),
          faint: "var(--border-faint)",
          light: "var(--border-light)",
          medium: "var(--border-medium)",
          strong: "var(--border-strong)"
        },
        input: withOpacity("--input"),
        ring: withOpacity("--ring"),
        background: withOpacity("--background"),
        foreground: withOpacity("--foreground"),
        primary: {
          DEFAULT: withOpacity("--primary"),
          foreground: withOpacity("--primary-foreground")
        },
        secondary: {
          DEFAULT: withOpacity("--secondary"),
          foreground: withOpacity("--secondary-foreground")
        },
        destructive: {
          DEFAULT: withOpacity("--destructive"),
          foreground: withOpacity("--destructive-foreground")
        },
        muted: {
          DEFAULT: withOpacity("--muted"),
          foreground: withOpacity("--muted-foreground")
        },
        accent: {
          DEFAULT: withOpacity("--accent"),
          foreground: withOpacity("--accent-foreground")
        },
        popover: {
          DEFAULT: withOpacity("--popover"),
          foreground: withOpacity("--popover-foreground")
        },
        card: {
          DEFAULT: withOpacity("--card"),
          foreground: withOpacity("--card-foreground")
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)"
        },
        success: {
          DEFAULT: withOpacity("--success"),
          foreground: withOpacity("--success-foreground")
        },
        warning: {
          DEFAULT: withOpacity("--warning"),
          foreground: withOpacity("--warning-foreground")
        },
        info: {
          DEFAULT: withOpacity("--info"),
          foreground: withOpacity("--info-foreground")
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", ...fontFamily.sans],
        serif: ['"Merriweather"', ...fontFamily.serif],
        handwritten: ['"Kalam"', '"Yomogi"', "cursive"],
        rounded: ['"M PLUS Rounded 1c"', '"Kosugi Maru"', "sans-serif"]
      },
      boxShadow: {
        "paper-sm": "0 1px 3px -1px rgba(60, 40, 25, 0.08), 0 1px 2px 0 rgba(60, 40, 25, 0.06)",
        "paper-md": "0 4px 8px -2px rgba(60, 40, 25, 0.10), 0 2px 4px -2px rgba(60, 40, 25, 0.08)",
        "paper-float": "0 12px 28px -6px rgba(60, 40, 25, 0.15), 0 6px 12px -4px rgba(60, 40, 25, 0.10)"
      },
      keyframes: {
        "skeleton-shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "slide-out": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(8px)" }
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateY(16px) scale(0.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "toast-out": {
          from: { opacity: "1", transform: "translateY(0) scale(1)" },
          to: { opacity: "0", transform: "translateY(16px) scale(0.96)" }
        }
      },
      animation: {
        "skeleton-shimmer": "skeleton-shimmer 2s ease-in-out infinite",
        "slide-in": "slide-in 180ms var(--ease-gentle)",
        "slide-out": "slide-out 150ms var(--ease-smooth)",
        "toast-in": "toast-in 250ms var(--ease-gentle)",
        "toast-out": "toast-out 200ms var(--ease-smooth)"
      }
    }
  }
};
var preset_default = preset;
export {
  preset_default as default
};
//# sourceMappingURL=preset.js.map