import { Link } from "react-router-dom";
import InkButton from "./InkButton";
import { usePluginPricing } from "@/hooks/usePluginPricing";
import type { Plugin } from "@/data/plugins";
import { copy } from "@/copy";
import { Moonbase } from "@/lib/moonbase";

/**
 * One plugin, as a card on the home grid: the UI art on top, then the name,
 * the one-line pitch, the price, and two actions. The top-right corner is
 * sliced at the brand pitch; the whole card lifts a couple of pixels on hover.
 *
 * Released and in-development plugins share the shape — what changes is the
 * status chip, the accent hue, and whether the price row shows money or a
 * "coming soon".
 */
const PluginCard = ({ plugin }: { plugin: Plugin }) => {
  const card = plugin.slug === "fiction" ? copy.fiction.card : copy.chaosverb.card;
  const released = plugin.status === "released";

  const pricing = usePluginPricing(plugin.slug, {
    price: plugin.price ?? 0,
    regularPrice: plugin.regularPrice ?? 0,
  });
  const onSale = released && pricing.regularPrice > pricing.price;

  return (
    <article
      className="group corner-cut overflow-hidden rounded-lg border border-[color:var(--border-subtle)] bg-parchment-hi shadow-card transition-[border-color,box-shadow,transform] duration-[200ms] ease-editorial hover:border-[color:var(--accent-raw)] hover:shadow-lift hover:-translate-y-0.5"
    >
      <Link
        to={`/plugins/${plugin.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="block relative aspect-[3/2] overflow-hidden bg-[linear-gradient(120deg,#E9CDA8,#D8B68C)]"
      >
        <img
          src={plugin.cardArt}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </Link>

      <div className="px-[22px] pt-[18px] pb-[22px]">
        <div className="flex items-baseline justify-between gap-2.5 mb-1">
          <Link
            to={`/plugins/${plugin.slug}`}
            className="font-editorial italic text-[26px] leading-none text-[color:var(--ink)] transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--accent-raw)]"
          >
            {plugin.name}
          </Link>
          <span
            className="font-mono font-semibold text-[9px] tracking-[0.14em] uppercase rounded-[10px] border px-2 py-[3px] whitespace-nowrap"
            style={
              released
                ? { color: "var(--ink-3)", borderColor: "var(--ink-line)" }
                : { color: plugin.accent, borderColor: plugin.accent }
            }
          >
            {card.status}
          </span>
        </div>

        <div
          className="font-mono font-semibold text-[11.5px] tracking-[0.14em] uppercase mb-2.5"
          style={{ color: plugin.accent }}
        >
          {card.tagline}
        </div>

        <p className="font-mono text-[13.5px] tracking-[0.015em] leading-[1.6] text-[color:var(--ink-2)] mb-[18px]">
          {card.blurb}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          {released ? (
            <div key={pricing.price} className="state-fade flex items-baseline gap-3">
              <span className="font-mono font-semibold text-[19px] tabular-nums text-[color:var(--ink)]">
                ${pricing.price}
              </span>
              {onSale && (
                <>
                  <span className="font-mono text-[12px] tabular-nums line-through text-[color:var(--ink-3)]">
                    ${pricing.regularPrice}
                  </span>
                  <span className="font-mono font-semibold text-[9px] uppercase tracking-[0.16em] text-[color:var(--accent-raw)]">
                    {copy.chaosverb.card.saleNote}
                  </span>
                </>
              )}
            </div>
          ) : (
            <span
              className="font-mono font-semibold text-[10px] uppercase tracking-[0.18em]"
              style={{ color: plugin.accent }}
            >
              {copy.fiction.card.price}
            </span>
          )}

          <span className="flex-1" />

          {released ? (
            <InkButton
              variant="ghost"
              size="sm"
              onClick={() => Moonbase.download_product({ product_id: plugin.slug })}
            >
              {card.secondaryButton}
            </InkButton>
          ) : (
            <InkButton variant="ghost" size="sm" to={`/plugins/${plugin.slug}#notify`}>
              {card.secondaryButton}
            </InkButton>
          )}
          <InkButton size="sm" to={`/plugins/${plugin.slug}`}>
            {card.primaryButton}
          </InkButton>
        </div>
      </div>
    </article>
  );
};

export default PluginCard;
