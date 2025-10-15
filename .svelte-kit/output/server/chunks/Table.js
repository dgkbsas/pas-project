import { V as attr_class, a0 as stringify } from "./index2.js";
/* empty css                                         */
import { e as escape_html } from "./context.js";
function EmptyState($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      icon,
      title,
      description,
      action,
      class: className = "",
      children
    } = $$props;
    $$renderer2.push(`<div${attr_class(`empty-state ${stringify(className)}`, "svelte-sio7ch")}>`);
    if (icon) {
      $$renderer2.push("<!--[-->");
      const Icon = icon;
      $$renderer2.push(`<div class="empty-state-icon svelte-sio7ch"><!---->`);
      Icon($$renderer2, { size: 48 });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <h3 class="empty-state-title svelte-sio7ch">${escape_html(title)}</h3> `);
    if (description) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="empty-state-description svelte-sio7ch">${escape_html(description)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (action) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="empty-state-action svelte-sio7ch">${escape_html(action.label)}</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (children) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="empty-state-children svelte-sio7ch">`);
      children($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Table($$renderer, $$props) {
  let { class: className = "", children } = $$props;
  $$renderer.push(`<div${attr_class(`table-container ${stringify(className)}`, "svelte-1i9hzo7")}><table class="table svelte-1i9hzo7">`);
  children?.($$renderer);
  $$renderer.push(`<!----></table></div>`);
}
export {
  EmptyState as E,
  Table as T
};
