import type { plugins } from "../src/data/plugins";
import type { copy } from "../src/copy";

export function loadSiteData(root: string): Promise<{ plugins: typeof plugins; copy: typeof copy }>;
