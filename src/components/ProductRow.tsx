import { Link } from "react-router-dom";
import PluginScreenshot from "./PluginScreenshot";
import Eyebrow from "./primitives/Eyebrow";
import type { Plugin } from "@/data/plugins";
import { copy } from "@/copy";

const ProductRow = ({ plugin }: { plugin: Plugin }) => {
  const c = copy.productRow;
  const cv = copy.chaosverb;
  const onSale = plugin.regularPrice > plugin.price;

  return (
    <article className="grid md:grid-cols-12 gap-10 md:gap-16 items-center py-24 md:py-32 border-t border-hairline first:border-t-0">
      <Link
        to={`/plugins/${plugin.slug}`}
        aria-label={`open ${plugin.name}`}
        className="block md:col-span-7 group"
      >
        <PluginScreenshot
          name={plugin.name}
          ratio="wide"
          src={plugin.screenshot}
          fit="contain"
          alt={`${plugin.name} plugin interface`}
        />
      </Link>

      <div className="md:col-span-4 md:col-start-9 flex flex-col gap-8">
        <div>
          <Eyebrow className="mb-5">{c.eyebrow}</Eyebrow>
          <h2 className="font-display font-light text-[44px] md:text-[56px] leading-[1.0] tracking-[-0.02em] lowercase">
            {plugin.name}
          </h2>
          <p className="mt-5 font-editorial italic text-[20px] md:text-[22px] leading-[1.35] text-[color:var(--text-secondary)]">
            {plugin.tagline}
          </p>
        </div>

        <p className="font-sans font-normal text-[16px] md:text-[17px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[42ch]">
          {plugin.shortDescription}
        </p>

        <div className="flex items-baseline gap-4 font-mono text-[13px] tabular-nums">
          <span className="text-[color:var(--text-primary)]">${plugin.price}</span>
          {onSale && (
            <>
              <span className="line-through text-[color:var(--text-tertiary)]">${plugin.regularPrice}</span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--accent-raw)]">
                {cv.saleBadge}
              </span>
            </>
          )}
        </div>

        <div className="flex items-baseline gap-8 pt-2">
          <Link
            to={`/plugins/${plugin.slug}`}
            className="group inline-flex items-baseline gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
          >
            <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
              {c.primaryButton}
            </span>
            <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to={`/plugins/${plugin.slug}#try`}
            className="text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors duration-[600ms] ease-editorial"
          >
            {c.secondaryButton}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductRow;
