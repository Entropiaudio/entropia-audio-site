import { Link } from "react-router-dom";
import PluginScreenshot from "./PluginScreenshot";
import type { Plugin } from "@/data/plugins";

const ProductRow = ({ plugin }: { plugin: Plugin }) => {
  return (
    <article className="grid md:grid-cols-2 gap-10 md:gap-16 items-center py-16 md:py-24 border-t border-hairline first:border-t-0">
      <Link to={`/plugins/${plugin.slug}`} className="block group">
        <PluginScreenshot name={plugin.name} />
      </Link>

      <div className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
            {plugin.name}
          </h2>
          <span className="font-mono text-sm text-foreground/60 flex items-baseline gap-2">
            <span className="text-foreground">${plugin.price}</span>
            {plugin.regularPrice > plugin.price && (
              <>
                <span className="line-through text-foreground/40">
                  ${plugin.regularPrice}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-accent">
                  launch sale
                </span>
              </>
            )}
          </span>
        </div>

        <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-md">
          {plugin.shortDescription}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Link
            to={`/plugins/${plugin.slug}#buy`}
            className="text-sm px-5 py-3 bg-foreground text-background hover:bg-accent transition-colors"
          >
            buy
          </Link>
          <Link
            to={`/plugins/${plugin.slug}#try`}
            className="text-sm px-5 py-3 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            try free
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductRow;
