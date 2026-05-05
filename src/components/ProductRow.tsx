import { Link } from "react-router-dom";
import PluginScreenshot from "./PluginScreenshot";
import type { Plugin } from "@/data/plugins";

const ProductRow = ({ plugin }: { plugin: Plugin }) => {
  const onSale = plugin.regularPrice > plugin.price;

  return (
    <article className="grid md:grid-cols-2 gap-12 md:gap-20 items-center py-20 md:py-28 border-t border-hairline first:border-t-0">
      <Link
        to={`/plugins/${plugin.slug}`}
        aria-label={`open ${plugin.name}`}
        className="block group"
      >
        <PluginScreenshot name={plugin.name} ratio="wide" />
      </Link>

      <div className="flex flex-col gap-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-3">
            01 / plugin
          </div>
          <h2 className="text-4xl md:text-5xl font-display tracking-tight-display leading-[1.05]">
            {plugin.name}
          </h2>
          <p className="mt-4 text-xl md:text-2xl text-foreground/65 font-display-italic">
            {plugin.tagline}
          </p>
        </div>

        <p className="text-base md:text-lg text-foreground/70 leading-relaxed measure-tight">
          {plugin.shortDescription}
        </p>

        <div className="flex items-baseline gap-4 font-mono text-sm tabular-nums">
          <span className="text-foreground text-base">${plugin.price}</span>
          {onSale && (
            <>
              <span className="line-through text-foreground/50">${plugin.regularPrice}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
                launch sale
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Link
            to={`/plugins/${plugin.slug}`}
            className="text-sm px-6 py-3 bg-foreground text-background hover:bg-accent transition-colors"
          >
            see chaosverb
          </Link>
          <Link
            to={`/plugins/${plugin.slug}#try`}
            className="text-sm px-6 py-3 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            try free
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductRow;
