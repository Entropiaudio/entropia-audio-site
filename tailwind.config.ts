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
        sans: ['"Barlow Condensed"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Barlow Condensed"', 'Inter', 'system-ui', 'sans-serif'],
        editorial: ['Fraunces', 'Georgia', '"Times New Roman"', 'serif'],
        mono: ['"Barlow Condensed"', 'Inter', 'ui-monospace', 'sans-serif'],
      },
      letterSpacing: {
        'eyebrow':       '0.18em',
        'label':         '0.14em',
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

        // daylight grounds + ink, usable as bg-paper, bg-parchment, text-ink…
        paper:          'var(--paper)',
        parchment:      'var(--parchment)',
        'parchment-hi': 'var(--parchment-hi)',
        tan:            'var(--tan)',
        clay:           'var(--clay)',
        umber:          'var(--umber)',
        field:          'var(--field)',
        ink:            'var(--ink)',
        'ink-2':        'var(--ink-2)',
        'ink-3':        'var(--ink-3)',
        'ink-4':        'var(--ink-4)',
        pop:            'var(--pop)',

        // shadcn / tailwind tokens (HSL-channel), kept for compatibility
        hairline: "hsl(var(--hairline))",
        "plugin-surface": {
          DEFAULT: "hsl(var(--plugin-surface))",
          foreground: "hsl(var(--plugin-surface-foreground))",
        },
        // default element border = warm ink hairline; stronger via border-input
        border: "hsl(var(--border) / 0.16)",
        input: "hsl(var(--input) / 0.35)",
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
        // daylight: buttons 4–6px, surfaces 8–12px
        none: '0',
        DEFAULT: '6px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      boxShadow: {
        // warm plum-ink shadows, the way paper casts. never flat black.
        card: '0 6px 20px rgba(38, 16, 25, 0.10)',
        lift: '0 14px 34px rgba(38, 16, 25, 0.18)',
        ink:  '0 3px 7px rgba(38, 16, 25, 0.24)',
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
