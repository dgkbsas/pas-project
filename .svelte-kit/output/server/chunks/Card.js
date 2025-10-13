import { V as attr_class, a0 as stringify } from "./index2.js";
function Card($$renderer, $$props) {
  let { class: className = "", header, footer, children } = $$props;
  $$renderer.push(`<div${attr_class(`card ${stringify(className)}`, "svelte-7d5xe5")}>`);
  if (header) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<div class="card-header svelte-7d5xe5">`);
    header($$renderer);
    $$renderer.push(`<!----></div>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--> <div class="card-body svelte-7d5xe5">`);
  children?.($$renderer);
  $$renderer.push(`<!----></div> `);
  if (footer) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<div class="card-footer svelte-7d5xe5">`);
    footer($$renderer);
    $$renderer.push(`<!----></div>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
export {
  Card as C
};
