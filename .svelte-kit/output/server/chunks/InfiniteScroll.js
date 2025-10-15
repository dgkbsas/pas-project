import "clsx";
import "./Skeleton.js";
function InfiniteScroll($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { hasMore = true, onLoadMore, threshold = 200 } = $$props;
    $$renderer2.push(`<div class="infinite-scroll-sentinel svelte-k49ili">`);
    if (hasMore) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading-indicator svelte-k49ili"><div class="spinner svelte-k49ili"></div> <span>Cargando más...</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  InfiniteScroll as I
};
