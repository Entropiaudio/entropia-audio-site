import { useId } from "react";
import { Moon, Sun } from "lucide-react";
import { PLUGIN_SKINS, usePluginSkin } from "@/lib/pluginSkin";
import { copy } from "@/copy";

const ICON = { night: Moon, daylight: Sun } as const;

/**
 * Night / daylight, for the plugin plates. Every plate on the page follows
 * the one choice (see lib/pluginSkin.ts), so this sits once under the hero
 * and the story rows that reuse the main shot flip with it.
 */
const SkinSwitch = ({ className }: { className?: string }) => {
  const [skin, setSkin] = usePluginSkin();
  const labelId = useId();
  const t = copy.shared.skinSwitch;

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span id={labelId} className="skin-switch-label">
          {t.label}
        </span>
        <div role="group" aria-labelledby={labelId} className="skin-switch">
          {PLUGIN_SKINS.map((s) => {
            const Icon = ICON[s];
            return (
              <button
                key={s}
                type="button"
                className="skin-switch-option"
                aria-pressed={skin === s}
                onClick={() => setSkin(s)}
              >
                <Icon size={11} strokeWidth={2.25} aria-hidden="true" />
                {t[s]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkinSwitch;
