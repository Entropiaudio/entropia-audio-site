import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge has to be told about the text-fluid-* sizes
// (tailwind.config.ts): it can't know a custom text-* class is a font-size,
// so it assumes a colour — and then cn("text-fluid-10", "text-[color:…]")
// silently drops the size as a "conflicting colour".
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [(value: string) => value.startsWith("fluid-")] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
