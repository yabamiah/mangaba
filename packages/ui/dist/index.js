import {
  useClickOutside,
  useToggle
} from "./chunk-AHIKJ7U7.js";
import {
  Button,
  ButtonGroup,
  IconButton,
  RadioButton,
  SelectionButton,
  ToggleButton,
  buttonVariants,
  cn,
  getMoonPhase,
  useButtonGroup
} from "./chunk-5SXWAUHV.js";

// src/components/Card/Card.tsx
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var Card = forwardRef(
  ({ className, washiTape, washiTapePosition = "top", hasBindingHoles, hasCornerFold, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(
        "card-paper relative",
        washiTape && washiTape !== "none" && `washi-tape-${washiTapePosition} washi-color-${washiTape}`,
        hasBindingHoles && "has-binding-holes",
        hasCornerFold && "has-corner-fold",
        className
      ),
      ...props
    }
  )
);
Card.displayName = "Card";
var CardHeader = forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6 pb-0", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = forwardRef(
  ({ className, level = 3, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      role: "heading",
      "aria-level": level,
      className: cn(
        "text-xl font-normal leading-none tracking-tight",
        className
      ),
      style: { fontFamily: "var(--font-handwritten)" },
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
var CardDescription = forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-muted-foreground text-sm opacity-80", className),
    style: { fontFamily: "var(--font-rounded)" },
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

// src/components/Input/Input.tsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var Input = forwardRef2(
  ({ className, type, ...props }, ref) => /* @__PURE__ */ jsx2(
    "input",
    {
      type,
      className: cn(
        "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-11 w-full rounded-md border px-4 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  )
);
Input.displayName = "Input";

// src/components/Select/Select.tsx
import React3 from "react";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var Select = React3.forwardRef(
  ({ className, options, label, error, ...props }, ref) => {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      label && /* @__PURE__ */ jsx3("label", { className: "text-sm font-medium", children: label }),
      /* @__PURE__ */ jsx3(
        "select",
        {
          ref,
          className: cn(
            "flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          ),
          ...props,
          children: options.map((option) => /* @__PURE__ */ jsx3("option", { value: option.value, children: option.label }, option.value))
        }
      ),
      error && /* @__PURE__ */ jsx3("p", { className: "text-xs text-destructive", children: error })
    ] });
  }
);
Select.displayName = "Select";

// src/components/Progress/Progress.tsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
var Progress = forwardRef3(
  ({ className, value = 0, max = 100, ...props }, ref) => /* @__PURE__ */ jsx4(
    "div",
    {
      ref,
      role: "progressbar",
      "aria-valuenow": value,
      "aria-valuemin": 0,
      "aria-valuemax": max,
      className: cn(
        "bg-secondary relative h-4 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx4(
        "div",
        {
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: {
            transform: `translateX(-${100 - 100 * (value ?? 0) / (max ?? 1)}%)`
          }
        }
      )
    }
  )
);
Progress.displayName = "Progress";

// src/components/Divider/Divider.module.css
var Divider_default = {};

// src/components/Divider/Divider.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
var sizeMap = {
  small: Divider_default.sizeSmall,
  normal: Divider_default.sizeNormal,
  large: Divider_default.sizeLarge
};
var Divider = ({
  type = "dashed",
  size = "normal",
  className
}) => /* @__PURE__ */ jsx5(
  "div",
  {
    className: cn(Divider_default.divider, Divider_default[type], sizeMap[size], className),
    "aria-hidden": "true",
    role: "separator"
  }
);

// src/components/StatsCard/StatsCard.tsx
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
var StatsCard = ({
  title,
  value,
  highlighted = false,
  subtext = "",
  className
}) => /* @__PURE__ */ jsxs2(
  "div",
  {
    className: cn(
      "relative p-4 rounded-xl border transition-all duration-300",
      highlighted ? "bg-card border-primary/30 shadow-sm dark:bg-card dark:border-primary/40" : "bg-card border-border/60 shadow-sm hover:bg-secondary dark:bg-card dark:border-border/40 dark:hover:bg-secondary",
      className
    ),
    children: [
      /* @__PURE__ */ jsx6("h3", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 font-mono", children: title }),
      /* @__PURE__ */ jsxs2("div", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsx6(
          "span",
          {
            className: cn(
              "text-2xl font-serif font-bold",
              highlighted ? "text-primary" : "text-foreground"
            ),
            children: value
          }
        ),
        subtext && /* @__PURE__ */ jsx6("span", { className: "text-xs text-muted-foreground", children: subtext })
      ] })
    ]
  }
);

// src/components/MoodIcon/MoodIcon.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
var MoodIcon = ({
  src,
  alt = "",
  className
}) => /* @__PURE__ */ jsx7(
  "div",
  {
    className: cn("inline-block bg-current", className),
    style: {
      maskImage: `url('${src}')`,
      maskSize: "contain",
      maskRepeat: "no-repeat",
      maskPosition: "center",
      WebkitMaskImage: `url('${src}')`,
      WebkitMaskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: "center"
    },
    role: "img",
    "aria-label": alt
  }
);

// src/components/HandDrawnTracker/HandDrawnTracker.tsx
import { jsx as jsx8, jsxs as jsxs3 } from "react/jsx-runtime";
var weekDays = ["M", "T", "W", "T", "F", "S", "S"];
var HandDrawnTracker = ({
  habits = [],
  weekLabel = "Week 42",
  className
}) => /* @__PURE__ */ jsxs3("div", { className: cn("w-full font-mono text-sm bg-secondary/30 dark:bg-secondary/20 p-4 rounded-lg border-2 border-dashed border-border relative overflow-hidden", className), children: [
  /* @__PURE__ */ jsx8("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-100/50 dark:bg-yellow-900/30 rotate-1 border border-yellow-200/50 dark:border-yellow-700/30 shadow-sm backdrop-blur-[1px]" }),
  /* @__PURE__ */ jsxs3("div", { className: "flex justify-between items-end mb-4 border-b-2 border-foreground dark:border-foreground/80 pb-1", children: [
    /* @__PURE__ */ jsx8("span", { className: "font-bold uppercase tracking-widest text-muted-foreground text-xs", children: "Rastreador Semanal" }),
    /* @__PURE__ */ jsx8("span", { className: "text-[10px] text-muted-foreground/70", children: weekLabel })
  ] }),
  /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-[1fr_repeat(7,24px)] gap-2 mb-2 items-center", children: [
    /* @__PURE__ */ jsx8("div", { className: "text-[10px] text-muted-foreground/70 italic text-right pr-2", children: "H\xE1bitos" }),
    weekDays.map((day, i) => /* @__PURE__ */ jsx8("div", { className: "text-center font-bold text-muted-foreground text-xs", children: day }, i))
  ] }),
  /* @__PURE__ */ jsx8("div", { className: "space-y-1", children: habits.map((habit, habitIdx) => /* @__PURE__ */ jsxs3("div", { className: "group relative", children: [
    /* @__PURE__ */ jsx8("div", { className: "absolute bottom-1 left-0 right-0 border-b border-border/50 pointer-events-none" }),
    /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-[1fr_repeat(7,24px)] gap-2 items-center relative z-10 py-1", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 truncate pr-2", children: [
        habit.important && /* @__PURE__ */ jsx8("span", { className: "text-primary font-bold text-lg leading-none mt-1", children: "*" }),
        /* @__PURE__ */ jsx8("span", { className: cn("truncate text-foreground/80 font-serif", habit.important && "font-semibold"), children: habit.name })
      ] }),
      habit.history.map((completed, i) => /* @__PURE__ */ jsx8("div", { className: "h-6 flex items-center justify-center", children: completed ? /* @__PURE__ */ jsx8("svg", { viewBox: "0 0 24 24", className: "w-4 h-4 text-primary dark:text-primary mx-auto", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx8("path", { d: "M18 6L6 18M6 6l12 12", className: "opacity-80" }) }) : /* @__PURE__ */ jsx8("div", { className: "w-1 h-1 rounded-full bg-muted-foreground/30 group-hover:bg-muted-foreground/50 transition-colors" }) }, i))
    ] })
  ] }, habitIdx)) }),
  /* @__PURE__ */ jsx8("div", { className: "mt-4 text-[10px] text-muted-foreground/70 text-right font-serif italic", children: "* atividades priorit\xE1rias" })
] });

// src/components/PageNavigator/PageNavigator.tsx
import { useState } from "react";

// src/components/PageNavigator/PageNavigator.module.css
var PageNavigator_default = {};

// src/components/PageNavigator/PageNavigator.tsx
import { Fragment, jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
var ChevronLeft = () => /* @__PURE__ */ jsx9("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx9("path", { d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" }) });
var ChevronRight = () => /* @__PURE__ */ jsx9("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx9("path", { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }) });
var PageNavigator = ({
  currentPage: controlledPage,
  totalPages = 12,
  onPageChange,
  className
}) => {
  const [internalPage, setInternalPage] = useState(controlledPage ?? 1);
  const [showJumpModal, setShowJumpModal] = useState(false);
  const page = controlledPage ?? internalPage;
  const setPage = (p) => {
    setInternalPage(p);
    onPageChange?.(p);
  };
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const jumpToPage = (p) => {
    setPage(p);
    setShowJumpModal(false);
  };
  return /* @__PURE__ */ jsxs4("div", { className: cn("relative flex flex-col items-center gap-2", className), children: [
    showJumpModal && /* @__PURE__ */ jsxs4(Fragment, { children: [
      /* @__PURE__ */ jsxs4("div", { className: "absolute bottom-full mb-2 w-64 bg-[#F9F8F4] dark:bg-[#2C2C2C] rounded-xl shadow-xl border-2 border-stone-200 dark:border-stone-700 p-4 z-50 overflow-hidden", children: [
        /* @__PURE__ */ jsx9(
          "div",
          {
            className: "absolute inset-0 opacity-[0.05] pointer-events-none",
            style: {
              backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }
          }
        ),
        /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between mb-3 px-1 relative z-10", children: [
          /* @__PURE__ */ jsx9("span", { className: "font-handwritten text-lg text-stone-600 dark:text-stone-300", children: "\xCDndice" }),
          /* @__PURE__ */ jsx9("span", { className: "text-[10px] uppercase tracking-widest text-stone-400 font-bold", children: "P\xE1ginas" })
        ] }),
        /* @__PURE__ */ jsx9(
          "div",
          {
            className: cn(
              "grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 relative z-10",
              PageNavigator_default.customScrollbar
            ),
            children: Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => /* @__PURE__ */ jsx9(
                "button",
                {
                  onClick: () => jumpToPage(pageNum),
                  className: cn(
                    "aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-rounded font-bold transition-all",
                    page === pageNum ? "border-orange-400 bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : "border-stone-200 bg-white dark:bg-stone-800 dark:border-stone-600 text-stone-500 hover:border-orange-200 hover:scale-105"
                  ),
                  children: pageNum
                },
                pageNum
              )
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsx9(
        "div",
        {
          className: "fixed inset-0 z-0",
          onClick: () => setShowJumpModal(false),
          onKeyDown: (e) => e.key === "Escape" && setShowJumpModal(false),
          role: "button",
          tabIndex: 0,
          "aria-label": "Fechar \xEDndice"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs4(
      "div",
      {
        className: cn(
          "bg-[#F9F8F4] dark:bg-[#1e1e1e] px-2 py-2 rounded-2xl border border-stone-200/60 dark:border-stone-700 flex items-center gap-1 transition-transform hover:-translate-y-0.5",
          PageNavigator_default.shadowPaperFloat
        ),
        children: [
          /* @__PURE__ */ jsx9(
            "button",
            {
              onClick: prevPage,
              disabled: page === 1,
              className: "w-11 h-11 flex items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors dark:text-stone-400 dark:hover:bg-stone-800",
              "aria-label": "P\xE1gina anterior",
              children: /* @__PURE__ */ jsx9(ChevronLeft, {})
            }
          ),
          /* @__PURE__ */ jsxs4(
            "button",
            {
              onClick: () => setShowJumpModal(!showJumpModal),
              className: "flex h-11 flex-col items-center justify-center rounded-xl border border-transparent px-4 transition-colors hover:border-orange-100 hover:bg-orange-50 dark:hover:border-orange-900/30 dark:hover:bg-orange-900/10 group",
              children: [
                /* @__PURE__ */ jsx9("span", { className: "text-[10px] uppercase tracking-widest text-stone-400 font-bold group-hover:text-orange-400 transition-colors", children: "P\xE1gina" }),
                /* @__PURE__ */ jsxs4("div", { className: "flex items-baseline gap-1 leading-none", children: [
                  /* @__PURE__ */ jsx9("span", { className: "font-handwritten text-xl font-bold text-stone-700 dark:text-stone-200 group-hover:text-orange-600 transition-colors", children: page }),
                  /* @__PURE__ */ jsxs4("span", { className: "text-[10px] text-stone-400", children: [
                    "/ ",
                    totalPages
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx9(
            "button",
            {
              onClick: nextPage,
              disabled: page === totalPages,
              className: "w-11 h-11 flex items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors dark:text-stone-400 dark:hover:bg-stone-800",
              "aria-label": "Pr\xF3xima p\xE1gina",
              children: /* @__PURE__ */ jsx9(ChevronRight, {})
            }
          )
        ]
      }
    )
  ] });
};

// src/components/FloatingBackground/FloatingBackground.tsx
import {
  useState as useState2,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from "react";
import { jsx as jsx10 } from "react/jsx-runtime";
var themes = {
  kawaii: {
    colors: [
      "oklch(0.85 0.15 0)",
      "oklch(0.90 0.12 85)",
      "oklch(0.85 0.10 175)",
      "oklch(0.88 0.08 280)"
    ],
    shapes: ["heart", "star", "flower", "sparkle", "circle"],
    maxShapes: 15,
    spawnRate: 0.02,
    minSize: 12,
    maxSize: 24
  },
  earthy: {
    colors: [
      "oklch(0.68 0.14 35)",
      "oklch(0.78 0.10 175)",
      "oklch(0.82 0.12 85)",
      "oklch(0.72 0.10 280)"
    ],
    shapes: ["circle", "triangle", "diamond", "pentagon"],
    maxShapes: 12,
    spawnRate: 0.015
  },
  celestial: {
    colors: [
      "oklch(0.80 0.15 260)",
      "oklch(0.75 0.12 220)",
      "oklch(0.90 0.08 50)",
      "oklch(0.95 0.05 180)"
    ],
    shapes: ["star", "moon", "sparkle", "circle"],
    maxShapes: 20,
    spawnRate: 0.025,
    blurEnabled: true
  },
  minimal: {
    colors: ["oklch(0.50 0.00 0)", "oklch(0.40 0.00 0)"],
    shapes: ["circle", "triangle", "diamond"],
    maxShapes: 8,
    spawnRate: 0.01,
    minOpacity: 0.05,
    maxOpacity: 0.15
  },
  springtime: {
    colors: [
      "oklch(0.88 0.18 140)",
      "oklch(0.85 0.20 350)",
      "oklch(0.92 0.15 90)",
      "oklch(0.82 0.12 30)"
    ],
    shapes: ["flower", "heart", "circle", "sparkle"],
    maxShapes: 18,
    spawnRate: 0.022
  }
};
var shapePaths = {
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  circle: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
  flower: "M12 2c-1.1 0-2 .9-2 2 0 .74.4 1.38 1 1.72v.78c-.83.55-1.5 1.4-1.86 2.41C8.28 8.54 7.17 8 6 8c-1.66 0-3 1.34-3 3s1.34 3 3 3c1.17 0 2.28-.54 3.14-.91.36 1.01 1.03 1.86 1.86 2.41v.78c-.6.34-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72v-.78c.83-.55 1.5-1.4 1.86-2.41.86.37 1.97.91 3.14.91 1.66 0 3-1.34 3-3s-1.34-3-3-3c-1.17 0-2.28.54-3.14.91-.36-1.01-1.03-1.86-1.86-2.41v-.78c.6-.34 1-.98 1-1.72 0-1.1-.9-2-2-2z",
  sparkle: "M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3z",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  cloud: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z",
  diamond: "M12 2L2 9l10 13L22 9z",
  triangle: "M12 2L2 22h20z",
  pentagon: "M12 2l7.35 5.35L16.7 17.7 12 22l-4.7-4.3-2.65-10.35z"
};
var FloatingBackground = ({
  enabled = true,
  theme = "earthy",
  customColors,
  customShapes
}) => {
  const [shapes, setShapes] = useState2([]);
  const animationRef = useRef(0);
  const nextIdRef = useRef(0);
  const config = useMemo(() => {
    const baseTheme = typeof theme === "string" ? themes[theme] || themes.earthy : theme;
    return {
      colors: customColors || baseTheme.colors,
      shapes: customShapes || baseTheme.shapes,
      maxShapes: baseTheme.maxShapes ?? 12,
      spawnRate: baseTheme.spawnRate ?? 0.015,
      minSize: baseTheme.minSize ?? 10,
      maxSize: baseTheme.maxSize ?? 18,
      minSpeed: baseTheme.minSpeed ?? 0.2,
      maxSpeed: baseTheme.maxSpeed ?? 0.5,
      minOpacity: baseTheme.minOpacity ?? 0.15,
      maxOpacity: baseTheme.maxOpacity ?? 0.35,
      blurEnabled: baseTheme.blurEnabled ?? false
    };
  }, [theme, customColors, customShapes]);
  const createShape = useCallback(() => {
    return {
      id: nextIdRef.current++,
      type: config.shapes[Math.floor(Math.random() * config.shapes.length)],
      x: Math.random() * 100,
      y: -10,
      size: config.minSize + Math.random() * (config.maxSize - config.minSize),
      speed: config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed),
      opacity: config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      blur: config.blurEnabled ? Math.random() * 2 : 0
    };
  }, [config]);
  useEffect(() => {
    if (!enabled) {
      setShapes([]);
      return;
    }
    const animate = () => {
      setShapes((prev) => {
        let next = prev.map((s) => ({
          ...s,
          y: s.y + s.speed,
          x: s.x + Math.sin(s.y / 30) * 0.2,
          rotation: s.rotation + s.rotationSpeed
        })).filter((s) => s.y < 110);
        if (Math.random() < config.spawnRate && next.length < config.maxShapes) {
          next = [...next, createShape()];
        }
        return next;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [enabled, config, createShape]);
  if (!enabled) return null;
  return /* @__PURE__ */ jsx10(
    "div",
    {
      className: "fixed inset-0 pointer-events-none z-0 overflow-hidden",
      "aria-hidden": "true",
      children: shapes.map((shape) => /* @__PURE__ */ jsx10(
        "svg",
        {
          className: "absolute select-none transition-opacity duration-300",
          style: {
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
            opacity: shape.opacity,
            transform: `rotate(${shape.rotation}deg)`,
            filter: shape.blur > 0 ? `blur(${shape.blur}px)` : void 0
          },
          viewBox: "0 0 24 24",
          fill: shape.color,
          children: /* @__PURE__ */ jsx10("path", { d: shapePaths[shape.type] })
        },
        shape.id
      ))
    }
  );
};

// src/components/DateBadge/DateBadge.tsx
import { useState as useState3, useEffect as useEffect2, useMemo as useMemo2 } from "react";

// src/components/DateBadge/DateBadge.module.css
var DateBadge_default = {};

// src/components/DateBadge/DateBadge.tsx
import { jsx as jsx11, jsxs as jsxs5 } from "react/jsx-runtime";
var Sun = ({ className }) => /* @__PURE__ */ jsx11("svg", { className, width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx11("path", { d: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 13h2a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2zm18 0h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM11 2v2a1 1 0 0 0 2 0V2a1 1 0 0 0-2 0zm0 18v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-2 0zM5.99 4.58a1 1 0 1 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41l-1.06-1.06zM19.42 5.99a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06zM7.05 18.36a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06z" }) });
var CloudRain = ({ className }) => /* @__PURE__ */ jsx11("svg", { className, width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx11("path", { d: "M16 11h-1.55A5.02 5.02 0 0 0 10 7a5.02 5.02 0 0 0-4.45 4H4a4 4 0 0 0 0 8h1.5l1.65-4.4a1 1 0 0 1 1.88.7l-1.42 3.8a.98.98 0 0 1-.93.6H4a6 6 0 0 1 0-12h.42A7.02 7.02 0 0 1 10 5a7.02 7.02 0 0 1 5.58 2.72A6.02 6.02 0 0 1 20 13a6 6 0 0 1-5.32 5.96.99.99 0 0 1-.2-1.98A4 4 0 0 0 20 13a4 4 0 0 0-4-4zm-5 5.5a1 1 0 0 0-1.88.68l-1.5 4a1 1 0 0 0 1.88.68l1.5-4a1 1 0 0 0-.38-1.36zm6 0a1 1 0 0 0-1.88.68l-1.5 4a1 1 0 0 0 1.88.68l1.5-4a1 1 0 0 0-.38-1.36z" }) });
var Clouds = ({ className }) => /* @__PURE__ */ jsx11("svg", { className, width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx11("path", { d: "M16 10h-1.55A5.02 5.02 0 0 0 10 6a5.02 5.02 0 0 0-4.45 4H4a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8zm0 6H4a2 2 0 0 1 0-4h1.42A4.98 4.98 0 0 0 10 8a4.98 4.98 0 0 0 4.58 4H16a2 2 0 0 1 0 4z" }) });
var DateBadge = ({
  date = /* @__PURE__ */ new Date(),
  onDateSelect,
  className,
  locale = "pt-BR"
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState3(false);
  const [selectedDate, setSelectedDate] = useState3(date);
  const [currentMonth, setCurrentMonth] = useState3(date);
  const [weather, setWeather] = useState3("rainy");
  const [temperature, setTemperature] = useState3(null);
  useEffect2(() => {
    setSelectedDate(date);
    setCurrentMonth(date);
  }, [date]);
  const wrapperRef = useClickOutside(() => setIsCalendarOpen(false));
  const moonPhase = getMoonPhase(selectedDate);
  const moonIcon = useMemo2(() => {
    switch (moonPhase) {
      case "new":
        return "\u{1F311}";
      case "waxing":
        return "\u{1F313}";
      case "full":
        return "\u{1F315}";
      case "waning":
        return "\u{1F317}";
    }
  }, [moonPhase]);
  const WeatherIcon = useMemo2(() => {
    switch (weather) {
      case "sunny":
        return Sun;
      case "rainy":
        return CloudRain;
      case "cloudy":
        return Clouds;
    }
  }, [weather]);
  useEffect2(() => {
    if (navigator.geolocation) {
      setTemperature(24);
      setWeather("cloudy");
    }
  }, []);
  const dayNumber = selectedDate.getDate();
  const monthName = selectedDate.toLocaleString(locale, { month: "long" });
  const year = selectedDate.getFullYear();
  const dayName = selectedDate.toLocaleString(locale, { weekday: "long" });
  const calendarDays = useMemo2(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    const prevMonthLastDay = new Date(y, m, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevMonthLastDay.getDate();
    const days = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        date: new Date(y, m - 1, day)
      });
    }
    const today = /* @__PURE__ */ new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(y, m, day);
      days.push({
        day,
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === today.toDateString(),
        isSelected: dayDate.toDateString() === selectedDate.toDateString(),
        date: dayDate
      });
    }
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        date: new Date(y, m + 1, day)
      });
    }
    return days;
  }, [currentMonth, selectedDate]);
  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);
  const selectDate = (dayDate) => {
    setSelectedDate(dayDate);
    setCurrentMonth(dayDate);
    onDateSelect?.(dayDate);
    setIsCalendarOpen(false);
  };
  const previousMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  const nextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  return /* @__PURE__ */ jsxs5("div", { className: cn(DateBadge_default.dateBadgeWrapper, className), ref: wrapperRef, children: [
    /* @__PURE__ */ jsxs5(
      "button",
      {
        className: cn(DateBadge_default.dateBadge, isCalendarOpen && DateBadge_default.open),
        onClick: toggleCalendar,
        children: [
          /* @__PURE__ */ jsx11("div", { className: DateBadge_default.dayNumber, children: dayNumber }),
          /* @__PURE__ */ jsxs5("div", { className: DateBadge_default.dateInfo, children: [
            /* @__PURE__ */ jsxs5("div", { className: DateBadge_default.dateText, children: [
              monthName,
              " ",
              year,
              " ",
              /* @__PURE__ */ jsxs5("span", { className: DateBadge_default.dayName, children: [
                "(",
                dayName.slice(0, 3),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxs5("div", { className: DateBadge_default.iconsRow, children: [
              /* @__PURE__ */ jsxs5("div", { className: DateBadge_default.iconItem, title: "Clima", children: [
                /* @__PURE__ */ jsx11("span", { className: DateBadge_default.label, children: "Clima:" }),
                /* @__PURE__ */ jsx11(WeatherIcon, { className: "w-4 h-4" }),
                temperature !== null && /* @__PURE__ */ jsxs5("span", { className: "font-rounded text-[10px] ml-1", children: [
                  temperature,
                  "\xB0"
                ] })
              ] }),
              /* @__PURE__ */ jsxs5("div", { className: DateBadge_default.iconItem, title: "Lua", children: [
                /* @__PURE__ */ jsx11("span", { className: DateBadge_default.label, children: "Lua:" }),
                /* @__PURE__ */ jsx11("span", { className: DateBadge_default.moonIcon, children: moonIcon })
              ] })
            ] })
          ] })
        ]
      }
    ),
    isCalendarOpen && /* @__PURE__ */ jsxs5("div", { className: DateBadge_default.calendarPopup, children: [
      /* @__PURE__ */ jsxs5("div", { className: DateBadge_default.calendarHeader, children: [
        /* @__PURE__ */ jsx11("button", { className: DateBadge_default.navBtn, onClick: previousMonth, title: "M\xEAs anterior", children: "\u2039" }),
        /* @__PURE__ */ jsx11("div", { className: DateBadge_default.calendarTitle, children: currentMonth.toLocaleString(locale, { month: "long", year: "numeric" }) }),
        /* @__PURE__ */ jsx11("button", { className: DateBadge_default.navBtn, onClick: nextMonth, title: "Pr\xF3ximo m\xEAs", children: "\u203A" })
      ] }),
      /* @__PURE__ */ jsx11("div", { className: DateBadge_default.weekdayLabels, children: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "S\xE1b"].map((day) => /* @__PURE__ */ jsx11("div", { className: DateBadge_default.weekdayLabel, children: day }, day)) }),
      /* @__PURE__ */ jsx11("div", { className: DateBadge_default.calendarGrid, children: calendarDays.map((day, i) => /* @__PURE__ */ jsx11(
        "button",
        {
          className: cn(
            DateBadge_default.calendarDay,
            day.isCurrentMonth && DateBadge_default.currentMonth,
            day.isToday && DateBadge_default.today,
            day.isSelected && DateBadge_default.selected
          ),
          onClick: (e) => {
            e.stopPropagation();
            selectDate(day.date);
          },
          children: day.day
        },
        i
      )) }),
      /* @__PURE__ */ jsx11("div", { className: DateBadge_default.calendarFooter, children: /* @__PURE__ */ jsx11(
        "button",
        {
          className: DateBadge_default.quickAction,
          onClick: (e) => {
            e.stopPropagation();
            const now = /* @__PURE__ */ new Date();
            setSelectedDate(now);
            setCurrentMonth(now);
            setIsCalendarOpen(false);
            onDateSelect?.(now);
          },
          children: "Hoje"
        }
      ) })
    ] })
  ] });
};

// src/components/MiniCalendar/MiniCalendar.tsx
import { jsx as jsx12, jsxs as jsxs6 } from "react/jsx-runtime";
var weekDays2 = ["D", "S", "T", "Q", "Q", "S", "S"];
var MiniCalendar = ({
  days = [],
  title = "Outubro 2023",
  className,
  onDayClick
}) => /* @__PURE__ */ jsxs6("div", { className: cn("w-full", className), children: [
  /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-center mb-4", children: [
    /* @__PURE__ */ jsx12("h3", { className: "text-sm font-semibold text-muted-foreground font-serif", children: title }),
    /* @__PURE__ */ jsx12("button", { className: "text-muted-foreground/60 hover:text-muted-foreground", children: /* @__PURE__ */ jsxs6("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: [
      /* @__PURE__ */ jsx12("circle", { cx: "5", cy: "12", r: "2" }),
      /* @__PURE__ */ jsx12("circle", { cx: "12", cy: "12", r: "2" }),
      /* @__PURE__ */ jsx12("circle", { cx: "19", cy: "12", r: "2" })
    ] }) })
  ] }),
  /* @__PURE__ */ jsx12("div", { className: "grid grid-cols-7 gap-1 mb-2 text-center", children: weekDays2.map((day, i) => /* @__PURE__ */ jsx12(
    "span",
    {
      className: cn(
        "text-[10px] font-mono",
        i === 0 || i === 6 ? "text-primary" : "text-muted-foreground"
      ),
      children: day
    },
    i
  )) }),
  /* @__PURE__ */ jsx12("div", { className: "grid grid-cols-7 gap-1", children: days.map((day, idx) => /* @__PURE__ */ jsxs6(
    "button",
    {
      onClick: () => day.hasEvent && onDayClick?.(day),
      disabled: !day.hasEvent,
      className: cn(
        "aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all cursor-default relative group",
        day.hasEvent ? "cursor-pointer hover:scale-105" : "",
        day.active ? "bg-foreground text-background shadow-md dark:bg-foreground dark:text-background" : day.isToday ? "border-2 border-primary text-primary" : "text-muted-foreground hover:bg-secondary dark:hover:bg-secondary/50",
        !day.currentMonth && "opacity-30"
      ),
      children: [
        day.day,
        day.hasEvent && !day.active && /* @__PURE__ */ jsx12("div", { className: "absolute bottom-1 w-1 h-1 rounded-full bg-primary" }),
        day.completionRate && day.completionRate > 0 && /* @__PURE__ */ jsxs6("div", { className: "absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 shadow-md border border-border", children: [
          day.completionRate,
          "% Conclu\xEDdo"
        ] })
      ]
    },
    idx
  )) }),
  /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-center gap-3 mt-4 pt-3 border-t border-dashed border-border/60", children: [
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsx12("div", { className: "w-2.5 h-2.5 rounded-[2px] bg-foreground shadow-sm" }),
      /* @__PURE__ */ jsx12("span", { className: "text-[9px] uppercase tracking-wide text-muted-foreground font-mono", children: "Trabalhado" })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsx12("div", { className: "w-2.5 h-2.5 rounded-[2px] border border-border bg-card flex items-center justify-center", children: /* @__PURE__ */ jsx12("div", { className: "w-1 h-1 rounded-full bg-primary" }) }),
      /* @__PURE__ */ jsx12("span", { className: "text-[9px] uppercase tracking-wide text-muted-foreground font-mono", children: "Descanso" })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsx12("div", { className: "w-2.5 h-2.5 rounded-[2px] border border-border bg-secondary/50" }),
      /* @__PURE__ */ jsx12("span", { className: "text-[9px] uppercase tracking-wide text-muted-foreground/70 font-mono", children: "Inativo" })
    ] })
  ] })
] });

// src/components/CalendarWidget/CalendarWidget.tsx
import { useState as useState4, useMemo as useMemo3 } from "react";

// src/components/CalendarWidget/CalendarWidget.module.css
var CalendarWidget_default = {};

// src/components/CalendarWidget/CalendarWidget.tsx
import { jsx as jsx13, jsxs as jsxs7 } from "react/jsx-runtime";
var months = [
  "Janeiro",
  "Fevereiro",
  "Mar\xE7o",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];
var dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];
var ArrowLeft = () => /* @__PURE__ */ jsx13("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx13("path", { d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" }) });
var ArrowRight = () => /* @__PURE__ */ jsx13("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx13("path", { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }) });
var CalendarWidget = ({
  isOpen = false,
  selectedDate: initialDate = /* @__PURE__ */ new Date(),
  onSelect,
  className
}) => {
  const [selectedDate, setSelectedDate] = useState4(initialDate);
  const [displayDate, setDisplayDate] = useState4(new Date(initialDate));
  const year = displayDate.getFullYear();
  const monthIndex = displayDate.getMonth();
  const monthLabel = `${months[monthIndex]} ${year}`;
  const calendarGrid = useMemo3(() => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const startDay = new Date(year, monthIndex, 1).getDay();
    const prevTotal = new Date(year, monthIndex, 0).getDate();
    const today = /* @__PURE__ */ new Date();
    const grid = [];
    for (let i = startDay - 1; i >= 0; i--) {
      grid.push({
        day: prevTotal - i,
        type: "other-month",
        date: new Date(year, monthIndex - 1, prevTotal - i)
      });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      grid.push({
        day,
        type: "curr-month",
        isToday: day === today.getDate() && monthIndex === today.getMonth() && year === today.getFullYear(),
        isSelected: day === selectedDate.getDate() && monthIndex === selectedDate.getMonth() && year === selectedDate.getFullYear(),
        date
      });
    }
    const remaining = 42 - grid.length;
    for (let day = 1; day <= remaining; day++) {
      grid.push({
        day,
        type: "other-month",
        date: new Date(year, monthIndex + 1, day)
      });
    }
    return grid;
  }, [year, monthIndex, selectedDate]);
  const changeMonth = (delta) => {
    setDisplayDate(
      new Date(displayDate.getFullYear(), displayDate.getMonth() + delta, 1)
    );
  };
  const selectDay = (date) => {
    setSelectedDate(date);
    onSelect?.(date);
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs7("div", { className: cn(CalendarWidget_default.miniCalendar, className), children: [
    /* @__PURE__ */ jsxs7("div", { className: CalendarWidget_default.calendarHeader, children: [
      /* @__PURE__ */ jsx13(
        "button",
        {
          className: CalendarWidget_default.calendarNavBtn,
          onClick: (e) => {
            e.stopPropagation();
            changeMonth(-1);
          },
          children: /* @__PURE__ */ jsx13(ArrowLeft, {})
        }
      ),
      /* @__PURE__ */ jsx13("div", { className: CalendarWidget_default.calendarTitle, children: monthLabel }),
      /* @__PURE__ */ jsx13(
        "button",
        {
          className: CalendarWidget_default.calendarNavBtn,
          onClick: (e) => {
            e.stopPropagation();
            changeMonth(1);
          },
          children: /* @__PURE__ */ jsx13(ArrowRight, {})
        }
      )
    ] }),
    /* @__PURE__ */ jsx13("div", { className: CalendarWidget_default.calendarWashi }),
    /* @__PURE__ */ jsx13("div", { className: CalendarWidget_default.calendarDaysHeader, children: dayLabels.map((day, i) => /* @__PURE__ */ jsx13("div", { className: CalendarWidget_default.calendarDayLabel, children: day }, i)) }),
    /* @__PURE__ */ jsx13("div", { className: CalendarWidget_default.calendarGrid, children: calendarGrid.map((cell, i) => /* @__PURE__ */ jsx13(
      "button",
      {
        className: cn(
          CalendarWidget_default.calendarDay,
          cell.type === "other-month" && CalendarWidget_default.otherMonth,
          cell.isToday && CalendarWidget_default.today,
          cell.isSelected && CalendarWidget_default.selected
        ),
        onClick: (e) => {
          e.stopPropagation();
          selectDay(cell.date);
        },
        children: cell.day
      },
      i
    )) }),
    /* @__PURE__ */ jsx13("div", { className: CalendarWidget_default.calendarFooter, children: "Clique na data para selecionar" })
  ] });
};

// src/components/AppTopbar/AppTopbar.tsx
import { Fragment as Fragment2, jsx as jsx14, jsxs as jsxs8 } from "react/jsx-runtime";
var SidebarIcon = () => /* @__PURE__ */ jsx14("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx14("path", { d: "M3 4h18v16H3V4zm2 2v12h4V6H5zm6 0v12h8V6h-8z" }) });
var ChevronRightIcon = () => /* @__PURE__ */ jsx14("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx14("path", { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }) });
var SinglePageIcon = () => /* @__PURE__ */ jsx14("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx14("path", { d: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" }) });
var DoublePageIcon = () => /* @__PURE__ */ jsx14("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx14("path", { d: "M3 18h9v-2H3v2zm0-5h12v-2H3v2zm0-7v2h18V6H3zm14 9.18V12l4 3.5-4 3.5v-3.32H15v-2.5h2z" }) });
var AppTopbar = ({
  sidebarOpen = true,
  activeContext = "home",
  viewMode = "double",
  plannerTitle = "",
  pageTitle = "",
  onToggleSidebar,
  onSelectHome,
  onViewModeChange,
  className
}) => /* @__PURE__ */ jsxs8(
  "header",
  {
    className: cn(
      "h-16 border-b border-border/60 glass z-10 flex items-center justify-between px-6 shrink-0",
      className
    ),
    children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-4 overflow-hidden", children: [
        !sidebarOpen && /* @__PURE__ */ jsx14(
          "button",
          {
            onClick: onToggleSidebar,
            className: "flex h-11 w-11 items-center justify-center rounded-xl hover:bg-secondary text-muted-foreground transition-colors",
            "aria-label": "Abrir sidebar",
            title: "Abrir sidebar",
            children: /* @__PURE__ */ jsx14(SidebarIcon, {})
          }
        ),
        /* @__PURE__ */ jsxs8("nav", { className: "flex items-center text-sm text-muted-foreground whitespace-nowrap overflow-hidden", children: [
          /* @__PURE__ */ jsx14(
            "button",
            {
              className: "hover:underline cursor-pointer hover:text-foreground transition-colors font-medium",
              onClick: onSelectHome,
              children: plannerTitle
            }
          ),
          activeContext === "page" && /* @__PURE__ */ jsxs8(Fragment2, { children: [
            /* @__PURE__ */ jsx14("span", { className: "mx-2 text-border", children: /* @__PURE__ */ jsx14(ChevronRightIcon, {}) }),
            /* @__PURE__ */ jsx14("span", { className: "font-semibold text-foreground", children: pageTitle })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx14("div", { className: "flex items-center gap-4", children: activeContext === "page" && /* @__PURE__ */ jsxs8(
        "div",
        {
          className: "flex items-center bg-secondary/50 p-1 rounded-2xl border-2 border-border/50",
          role: "tablist",
          "aria-label": "Modo de visualiza\xE7\xE3o",
          children: [
            /* @__PURE__ */ jsx14(
              "button",
              {
                onClick: () => onViewModeChange?.("single"),
                className: cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                  viewMode === "single" ? "bg-card shadow-paper-sm text-primary" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                ),
                role: "tab",
                "aria-selected": viewMode === "single",
                "aria-label": "P\xE1gina simples",
                title: "P\xE1gina simples",
                children: /* @__PURE__ */ jsx14(SinglePageIcon, {})
              }
            ),
            /* @__PURE__ */ jsx14(
              "button",
              {
                onClick: () => onViewModeChange?.("double"),
                className: cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                  viewMode === "double" ? "bg-card shadow-paper-sm text-primary" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                ),
                role: "tab",
                "aria-selected": viewMode === "double",
                "aria-label": "P\xE1gina dupla",
                title: "P\xE1gina dupla",
                children: /* @__PURE__ */ jsx14(DoublePageIcon, {})
              }
            )
          ]
        }
      ) })
    ]
  }
);

// src/components/Dashboard/Dashboard.tsx
import { useMemo as useMemo4 } from "react";
import { jsx as jsx15, jsxs as jsxs9 } from "react/jsx-runtime";
var BookOpenIcon = ({ className }) => /* @__PURE__ */ jsxs9("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx15("path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }),
  /* @__PURE__ */ jsx15("path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" })
] });
var FlameIcon = ({ className }) => /* @__PURE__ */ jsx15("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx15("path", { d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" }) });
var CheckCircleIcon = ({ className }) => /* @__PURE__ */ jsxs9("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx15("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
  /* @__PURE__ */ jsx15("polyline", { points: "22 4 12 14.01 9 11.01" })
] });
var CalendarIcon = ({ className }) => /* @__PURE__ */ jsxs9("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx15("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
  /* @__PURE__ */ jsx15("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
  /* @__PURE__ */ jsx15("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
  /* @__PURE__ */ jsx15("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
] });
var BellIcon = ({ className }) => /* @__PURE__ */ jsxs9("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx15("path", { d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }),
  /* @__PURE__ */ jsx15("path", { d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" })
] });
function formatSyncTime(date, labels) {
  if (!date) return labels.neverSynced;
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 6e4);
  if (diffMin < 1) return labels.justNow;
  if (diffMin < 60) return labels.minutesAgo(diffMin);
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return labels.hoursAgo(diffH);
  return labels.daysAgo(Math.floor(diffH / 24));
}
var MANGA_QUOTES = [
  { text: "Mesmo na escurid\xE3o mais profunda, uma fa\xEDsca de vontade pode iluminar o caminho.", author: "Berserk" },
  { text: "A for\xE7a n\xE3o vem de vencer. Vem de superar as dificuldades.", author: "Naruto" },
  { text: "Pessoas que n\xE3o podem jogar fora algo valioso nunca conseguem mudar nada.", author: "Fullmetal Alchemist" },
  { text: "O mundo n\xE3o \xE9 perfeito, mas est\xE1 aqui para n\xF3s \u2014 tente descobrir o que \xE9 bom.", author: "Fullmetal Alchemist" },
  { text: "Independente de qu\xE3o sombrio o mundo possa ser, o sol ainda nasce amanh\xE3.", author: "Vinland Saga" },
  { text: "Ningu\xE9m nasce com for\xE7a. Voc\xEA cresce ao superar a dor.", author: "One Piece" },
  { text: "A \xFAnica batalha que voc\xEA perde \xE9 aquela que abandona.", author: "Vagabond" }
];
function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 0).getTime()) / 864e5
  );
  return MANGA_QUOTES[dayOfYear % MANGA_QUOTES.length];
}
var Dashboard = ({
  stats = { chaptersRead: 0, chaptersTotal: 0, mangasFollowing: 0, streak: 0 },
  calendarDays = [],
  weeklyActivity = [],
  unreadMangas = [],
  lastRead,
  syncState = { status: "idle" },
  labels = {},
  onSearch,
  onMangaClick,
  onSync,
  onDateClick,
  className
}) => {
  const l = {
    overviewTitle: "Vis\xE3o geral",
    trackerTitle: "Atividade semanal",
    newChaptersTitle: "Novos cap\xEDtulos",
    calendarTitle: "Calend\xE1rio",
    btnSearch: "Buscar mang\xE1",
    statChapters: "Na biblioteca",
    statRead: "Lidos",
    statFollowing: "Acompanhando",
    statStreak: "Sequ\xEAncia",
    statDays: "dias seguidos",
    chaptersUnit: "cap\xEDtulos",
    mangasUnit: "mang\xE1s",
    syncing: "Sincronizando...",
    syncError: "Erro na sync",
    neverSynced: "nunca sincronizado",
    justNow: "agora mesmo",
    minutesAgo: (count) => `h\xE1 ${count} min`,
    hoursAgo: (count) => `h\xE1 ${count}h`,
    daysAgo: (count) => `h\xE1 ${count} dias`,
    syncFailure: "Falha na sincroniza\xE7\xE3o",
    chapterContinue: (chapter) => `Cap\xEDtulo ${chapter} \xB7 continuar leitura`,
    noWeeklyActivity: "Nenhuma atividade registrada nos \xFAltimos 7 dias.",
    unreadCount: (count) => `${count} n\xE3o lidos`,
    allCaughtUp: "Tudo em dia. Nenhum cap\xEDtulo novo no momento.",
    ...labels
  };
  const quote = useMemo4(() => {
    if (lastRead) {
      return {
        text: lastRead.mangaTitle,
        author: l.chapterContinue(lastRead.chapterNumber)
      };
    }
    if (l.fallbackQuote) return l.fallbackQuote;
    return getDailyQuote();
  }, [lastRead, l]);
  const streakHighlighted = stats.streak >= 7;
  const syncLabel = useMemo4(() => {
    if (syncState.status === "syncing") return l.syncing;
    if (syncState.status === "error") return l.syncError;
    return formatSyncTime(syncState.lastSyncedAt, l);
  }, [syncState, l]);
  const bannerStyle = lastRead?.coverUrl ? {
    backgroundImage: `url(${lastRead.coverUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center top"
  } : {};
  return /* @__PURE__ */ jsx15(
    "div",
    {
      className: cn(
        "w-full max-w-[1600px] min-h-full flex gap-1 justify-center",
        "transition-all duration-500 ease-out py-4 px-2 overflow-y-auto",
        className
      ),
      children: /* @__PURE__ */ jsx15("div", { className: "animate-in fade-in slide-in-from-bottom-4 duration-700 w-full", children: /* @__PURE__ */ jsx15("div", { className: "relative shadow-paper-float rounded-[2rem] overflow-hidden bg-transparent border-none", children: /* @__PURE__ */ jsx15("div", { className: "bg-card graph-paper relative z-20 px-8 py-10 md:px-12 md:py-12 rounded-[2rem]", children: /* @__PURE__ */ jsxs9("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-12", children: [
        /* @__PURE__ */ jsxs9("div", { className: "lg:col-span-8 flex flex-col gap-10", children: [
          /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex justify-between items-end mb-6", children: [
              /* @__PURE__ */ jsxs9("h2", { className: "text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsx15(BookOpenIcon, { className: "w-5 h-5" }),
                l.overviewTitle
              ] }),
              syncState.status === "error" && /* @__PURE__ */ jsx15("span", { className: "text-xs font-mono text-destructive bg-destructive/10 px-2 py-1 rounded", children: l.syncFailure })
            ] }),
            /* @__PURE__ */ jsxs9("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [
              /* @__PURE__ */ jsx15(
                StatsCard,
                {
                  title: l.statChapters,
                  value: stats.chaptersTotal,
                  subtext: l.chaptersUnit
                }
              ),
              /* @__PURE__ */ jsx15(
                StatsCard,
                {
                  title: l.statRead,
                  value: stats.chaptersRead,
                  highlighted: stats.chaptersRead > 0
                }
              ),
              /* @__PURE__ */ jsx15(
                StatsCard,
                {
                  title: l.statFollowing,
                  value: stats.mangasFollowing,
                  subtext: l.mangasUnit
                }
              ),
              /* @__PURE__ */ jsx15(
                StatsCard,
                {
                  title: l.statStreak,
                  value: stats.streak,
                  subtext: streakHighlighted ? `${l.statDays} \u{1F525}` : l.statDays,
                  highlighted: streakHighlighted
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsxs9("h2", { className: "text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx15(FlameIcon, { className: "w-5 h-5" }),
              l.trackerTitle
            ] }),
            weeklyActivity.length > 0 ? /* @__PURE__ */ jsx15(HandDrawnTracker, { habits: weeklyActivity }) : /* @__PURE__ */ jsx15("p", { className: "text-sm text-muted-foreground font-serif italic py-4", children: l.noWeeklyActivity })
          ] }),
          /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsxs9("h2", { className: "text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx15(BellIcon, { className: "w-5 h-5" }),
              l.newChaptersTitle,
              unreadMangas.length > 0 && /* @__PURE__ */ jsx15("span", { className: "ml-auto text-xs font-mono font-normal normal-case tracking-normal bg-destructive/10 text-destructive px-2 py-0.5 rounded-full", children: l.unreadCount(unreadMangas.reduce((acc, m) => acc + m.unreadCount, 0)) })
            ] }),
            unreadMangas.length === 0 ? /* @__PURE__ */ jsx15("p", { className: "text-sm text-muted-foreground font-serif italic py-2", children: l.allCaughtUp }) : /* @__PURE__ */ jsx15("div", { className: "space-y-2", children: unreadMangas.map((manga) => /* @__PURE__ */ jsxs9(
              "button",
              {
                onClick: () => onMangaClick?.(manga),
                className: "w-full flex items-center gap-3 p-2 rounded-lg border-b border-border/30 hover:bg-secondary/30 transition-colors text-left group",
                children: [
                  manga.coverUrl ? /* @__PURE__ */ jsx15(
                    "img",
                    {
                      src: manga.coverUrl,
                      alt: manga.title,
                      className: "w-8 h-12 object-cover rounded object-top flex-shrink-0"
                    }
                  ) : /* @__PURE__ */ jsx15(
                    "div",
                    {
                      className: cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        manga.accentColor
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx15("span", { className: "flex-1 text-sm text-muted-foreground font-serif italic group-hover:text-foreground transition-colors truncate", children: manga.title }),
                  /* @__PURE__ */ jsxs9("span", { className: "flex-shrink-0 text-xs font-mono bg-destructive/10 text-destructive px-2 py-0.5 rounded-full", children: [
                    "+",
                    manga.unreadCount
                  ] })
                ]
              },
              manga.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs9("div", { className: "lg:col-span-4 relative", children: [
          /* @__PURE__ */ jsx15("div", { className: "hidden lg:block absolute left-[-24px] top-0 bottom-0 w-px border-l border-dashed border-border" }),
          /* @__PURE__ */ jsxs9("div", { className: "bg-secondary/30 dark:bg-secondary/20 p-6 rounded-2xl border border-border/50", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2 mb-6 text-primary", children: [
              /* @__PURE__ */ jsx15(CalendarIcon, { className: "w-5 h-5" }),
              /* @__PURE__ */ jsx15("span", { className: "text-xs font-bold uppercase tracking-widest", children: l.calendarTitle })
            ] }),
            /* @__PURE__ */ jsx15(MiniCalendar, { days: calendarDays, onDayClick: (day) => day.date && onDateClick?.(day.date) })
          ] }),
          /* @__PURE__ */ jsxs9(
            "button",
            {
              onClick: onSearch,
              className: "w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-lg hover:opacity-90 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx15("span", { children: l.btnSearch }),
                /* @__PURE__ */ jsx15("div", { className: "w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]", children: "+" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs9("div", { className: "mt-4 flex items-center justify-center gap-1.5", children: [
            /* @__PURE__ */ jsx15(
              CheckCircleIcon,
              {
                className: cn(
                  "w-3.5 h-3.5",
                  syncState.status === "error" ? "text-destructive" : "text-muted-foreground"
                )
              }
            ),
            /* @__PURE__ */ jsx15("span", { className: "text-xs text-muted-foreground font-mono", children: syncLabel })
          ] })
        ] })
      ] }) }) }) })
    }
  );
};
export {
  AppTopbar,
  Button,
  ButtonGroup,
  CalendarWidget,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dashboard,
  DateBadge,
  Divider,
  FloatingBackground,
  HandDrawnTracker,
  IconButton,
  Input,
  MiniCalendar,
  MoodIcon,
  PageNavigator,
  Progress,
  RadioButton,
  Select,
  SelectionButton,
  StatsCard,
  ToggleButton,
  buttonVariants,
  cn,
  getMoonPhase,
  useButtonGroup,
  useClickOutside,
  useToggle
};
//# sourceMappingURL=index.js.map