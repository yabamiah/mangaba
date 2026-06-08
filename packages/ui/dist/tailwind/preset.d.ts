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
                border: string;
                input: string;
                ring: string;
                background: string;
                foreground: string;
                primary: {
                    DEFAULT: string;
                    foreground: string;
                };
                secondary: {
                    DEFAULT: string;
                    foreground: string;
                };
                destructive: {
                    DEFAULT: string;
                    foreground: string;
                };
                muted: {
                    DEFAULT: string;
                    foreground: string;
                };
                accent: {
                    DEFAULT: string;
                    foreground: string;
                };
                popover: {
                    DEFAULT: string;
                    foreground: string;
                };
                card: {
                    DEFAULT: string;
                    foreground: string;
                };
                chart: {
                    "1": string;
                    "2": string;
                    "3": string;
                    "4": string;
                    "5": string;
                };
                success: {
                    DEFAULT: string;
                    foreground: string;
                };
                warning: {
                    DEFAULT: string;
                    foreground: string;
                };
                info: {
                    DEFAULT: string;
                    foreground: string;
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
