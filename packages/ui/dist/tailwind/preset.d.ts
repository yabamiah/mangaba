/**
 * PequiPlan Tailwind CSS Preset
 *
 * Provides the MeriHari design system colors, typography, and spacing
 * as a Tailwind preset for use in consumer projects.
 *
 * @example
 * ```js
 * // tailwind.config.js
 * import pequiPreset from '@pequiplan/ui/tailwind';
 *
 * export default {
 *   presets: [pequiPreset],
 *   content: [
 *     './src/**\/*.{tsx,ts}',
 *     './node_modules/@pequiplan/ui/**\/*.{js,ts,tsx}',
 *   ],
 * };
 * ```
 */
declare const preset: {
    darkMode: readonly ["class"];
    theme: {
        container: {
            center: boolean;
            padding: string;
            screens: {
                "2xl": string;
            };
        };
        extend: {
            colors: {
                border: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    faint: string;
                    light: string;
                    medium: string;
                    strong: string;
                };
                input: ({ opacityValue }: {
                    opacityValue?: string | number;
                }) => string;
                ring: ({ opacityValue }: {
                    opacityValue?: string | number;
                }) => string;
                background: ({ opacityValue }: {
                    opacityValue?: string | number;
                }) => string;
                foreground: ({ opacityValue }: {
                    opacityValue?: string | number;
                }) => string;
                primary: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    foreground: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                };
                secondary: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    foreground: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                };
                destructive: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    foreground: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                };
                muted: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    foreground: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                };
                accent: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    foreground: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                };
                popover: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    foreground: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                };
                card: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    foreground: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                };
                chart: {
                    "1": string;
                    "2": string;
                    "3": string;
                    "4": string;
                    "5": string;
                };
                success: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    foreground: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                };
                warning: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    foreground: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                };
                info: {
                    DEFAULT: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                    foreground: ({ opacityValue }: {
                        opacityValue?: string | number;
                    }) => string;
                };
            };
            borderRadius: {
                lg: string;
                md: string;
                sm: string;
            };
            fontFamily: {
                sans: string[];
                serif: string[];
                handwritten: string[];
                rounded: string[];
            };
            boxShadow: {
                "paper-sm": string;
                "paper-md": string;
                "paper-float": string;
            };
            keyframes: {
                "skeleton-shimmer": {
                    "0%": {
                        backgroundPosition: string;
                    };
                    "100%": {
                        backgroundPosition: string;
                    };
                };
                "slide-in": {
                    from: {
                        opacity: string;
                        transform: string;
                    };
                    to: {
                        opacity: string;
                        transform: string;
                    };
                };
                "slide-out": {
                    from: {
                        opacity: string;
                        transform: string;
                    };
                    to: {
                        opacity: string;
                        transform: string;
                    };
                };
                "toast-in": {
                    from: {
                        opacity: string;
                        transform: string;
                    };
                    to: {
                        opacity: string;
                        transform: string;
                    };
                };
                "toast-out": {
                    from: {
                        opacity: string;
                        transform: string;
                    };
                    to: {
                        opacity: string;
                        transform: string;
                    };
                };
            };
            animation: {
                "skeleton-shimmer": string;
                "slide-in": string;
                "slide-out": string;
                "toast-in": string;
                "toast-out": string;
            };
        };
    };
};

export { preset as default };
