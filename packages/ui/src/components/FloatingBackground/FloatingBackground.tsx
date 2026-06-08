"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

type ShapeType =
  | "star"
  | "heart"
  | "circle"
  | "flower"
  | "sparkle"
  | "moon"
  | "cloud"
  | "diamond"
  | "triangle"
  | "pentagon";

interface FloatingShape {
  id: number;
  type: ShapeType;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  blur: number;
}

export interface ShapeTheme {
  colors: string[];
  shapes: ShapeType[];
  maxShapes?: number;
  spawnRate?: number;
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  minOpacity?: number;
  maxOpacity?: number;
  blurEnabled?: boolean;
}

const themes: Record<string, ShapeTheme> = {
  kawaii: {
    colors: [
      "oklch(0.85 0.15 0)",
      "oklch(0.90 0.12 85)",
      "oklch(0.85 0.10 175)",
      "oklch(0.88 0.08 280)",
    ],
    shapes: ["heart", "star", "flower", "sparkle", "circle"],
    maxShapes: 15,
    spawnRate: 0.02,
    minSize: 12,
    maxSize: 24,
  },
  earthy: {
    colors: [
      "oklch(0.68 0.14 35)",
      "oklch(0.78 0.10 175)",
      "oklch(0.82 0.12 85)",
      "oklch(0.72 0.10 280)",
    ],
    shapes: ["circle", "triangle", "diamond", "pentagon"],
    maxShapes: 12,
    spawnRate: 0.015,
  },
  celestial: {
    colors: [
      "oklch(0.80 0.15 260)",
      "oklch(0.75 0.12 220)",
      "oklch(0.90 0.08 50)",
      "oklch(0.95 0.05 180)",
    ],
    shapes: ["star", "moon", "sparkle", "circle"],
    maxShapes: 20,
    spawnRate: 0.025,
    blurEnabled: true,
  },
  minimal: {
    colors: ["oklch(0.50 0.00 0)", "oklch(0.40 0.00 0)"],
    shapes: ["circle", "triangle", "diamond"],
    maxShapes: 8,
    spawnRate: 0.01,
    minOpacity: 0.05,
    maxOpacity: 0.15,
  },
  springtime: {
    colors: [
      "oklch(0.88 0.18 140)",
      "oklch(0.85 0.20 350)",
      "oklch(0.92 0.15 90)",
      "oklch(0.82 0.12 30)",
    ],
    shapes: ["flower", "heart", "circle", "sparkle"],
    maxShapes: 18,
    spawnRate: 0.022,
  },
};

const shapePaths: Record<ShapeType, string> = {
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  circle:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
  flower:
    "M12 2c-1.1 0-2 .9-2 2 0 .74.4 1.38 1 1.72v.78c-.83.55-1.5 1.4-1.86 2.41C8.28 8.54 7.17 8 6 8c-1.66 0-3 1.34-3 3s1.34 3 3 3c1.17 0 2.28-.54 3.14-.91.36 1.01 1.03 1.86 1.86 2.41v.78c-.6.34-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72v-.78c.83-.55 1.5-1.4 1.86-2.41.86.37 1.97.91 3.14.91 1.66 0 3-1.34 3-3s-1.34-3-3-3c-1.17 0-2.28.54-3.14.91-.36-1.01-1.03-1.86-1.86-2.41v-.78c.6-.34 1-.98 1-1.72 0-1.1-.9-2-2-2z",
  sparkle: "M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3z",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  cloud:
    "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z",
  diamond: "M12 2L2 9l10 13L22 9z",
  triangle: "M12 2L2 22h20z",
  pentagon: "M12 2l7.35 5.35L16.7 17.7 12 22l-4.7-4.3-2.65-10.35z",
};

export interface FloatingBackgroundProps {
  enabled?: boolean;
  theme?: string | ShapeTheme;
  customColors?: string[];
  customShapes?: ShapeType[];
}

export const FloatingBackground: React.FC<FloatingBackgroundProps> = ({
  enabled = true,
  theme = "earthy",
  customColors,
  customShapes,
}) => {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const animationRef = useRef<number>(0);
  const nextIdRef = useRef(0);

  const config = useMemo(() => {
    const baseTheme =
      typeof theme === "string" ? themes[theme] || themes.earthy : theme;
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
      blurEnabled: baseTheme.blurEnabled ?? false,
    };
  }, [theme, customColors, customShapes]);

  const createShape = useCallback((): FloatingShape => {
    return {
      id: nextIdRef.current++,
      type: config.shapes[Math.floor(Math.random() * config.shapes.length)],
      x: Math.random() * 100,
      y: -10,
      size:
        config.minSize + Math.random() * (config.maxSize - config.minSize),
      speed:
        config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed),
      opacity:
        config.minOpacity +
        Math.random() * (config.maxOpacity - config.minOpacity),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      blur: config.blurEnabled ? Math.random() * 2 : 0,
    };
  }, [config]);

  useEffect(() => {
    if (!enabled) {
      setShapes([]);
      return;
    }

    const animate = () => {
      setShapes((prev) => {
        let next = prev
          .map((s) => ({
            ...s,
            y: s.y + s.speed,
            x: s.x + Math.sin(s.y / 30) * 0.2,
            rotation: s.rotation + s.rotationSpeed,
          }))
          .filter((s) => s.y < 110);

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

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {shapes.map((shape) => (
        <svg
          key={shape.id}
          className="absolute select-none transition-opacity duration-300"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
            opacity: shape.opacity,
            transform: `rotate(${shape.rotation}deg)`,
            filter: shape.blur > 0 ? `blur(${shape.blur}px)` : undefined,
          }}
          viewBox="0 0 24 24"
          fill={shape.color}
        >
          <path d={shapePaths[shape.type]} />
        </svg>
      ))}
    </div>
  );
};
