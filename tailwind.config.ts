import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        editorial: ['Fraunces', 'Georgia', '"Times New Roman"', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // editorial type scale, paired with weight + tracking utilities
        'eyebrow':         ['12px',  { lineHeight: '1', letterSpacing: '0.12em', fontWeight: '500' }],
        'eyebrow-lg':      ['13px',  { lineHeight: '1', letterSpacing: '0.12em', fontWeight: '500' }],
        'ui':              ['14px',  { lineHeight: '1.4',  letterSpacing: '0',     fontWeight: '500' }],
        'ui-lg':           ['15px',  { lineHeight: '1.4',  letterSpacing: '0',     fontWeight: '500' }],
        'mono-spec':       ['12px',  { lineHeight: '1.5',  letterSpacing: '0',     fontWeight: '400' }],
        'mono-spec-lg':    ['13px',  { lineHeight: '1.5',  letterSpacing: '0',     fontWeight: '400' }],
        'body-editorial':  ['17px',  { lineHeight: '1.6',  letterSpacing: '0',     fontWeight: '400' }],
        'body-editorial-lg': ['19px',{ lineHeight: '1.6',  letterSpacing: '0',     fontWeight: '400' }],
        'section':         ['56px',  { lineHeight: '1.0',  letterSpacing: '-0.02em', fontWeight: '300' }],
        'section-lg':      ['72px',  { lineHeight: '1.0',  letterSpacing: '-0.02em', fontWeight: '300' }],
        'hero':            ['96px',  { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '300' }],
        'hero-lg':         ['128px', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '300' }],
      },
      letterSpacing: {
        'eyebrow':       '0.12em',
        'tightest':      '-0.03em',
        'tight-display': '-0.02em',
      },
      maxWidth: {
        '2xs': '16rem',
        'measure': '62ch',
        'editorial': '920px',
        'wide': '1280px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '128': '32rem',
        '192': '48rem',
      },
      colors: {
        // raw spec colors, usable as bg-bg, text-text-primary, etc.
        bg:            'var(--bg)',
        surface:       'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary':  'var(--text-tertiary)',
        copper:        'var(--accent-raw)',
        'copper-muted':'var(--accent-muted)',
        'border-soft': 'var(--border-soft)',

        // shadcn / tailwind tokens (HSL-channel), kept for compatibility
        hairline: "hsl(var(--hairline))",
        "plugin-surface": {
          DEFAULT: "hsl(var(--plugin-surface))",
          foreground: "hsl(var(--plugin-surface-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        // cap at 4px, keep edges architectural
        none: '0',
        DEFAULT: '2px',
        sm: '1px',
        md: '3px',
        lg: '4px',
        full: '9999px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        'editorial-fast': '400ms',
        'editorial':      '600ms',
        'editorial-slow': '800ms',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in":        "fade-in 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
