import { $ as attributes, a0 as stringify } from "./index2.js";
/* empty css                                     */
function Button($$renderer, $$props) {
  let {
    variant = "primary",
    size = "md",
    loading = false,
    class: className = "",
    disabled,
    children,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  $$renderer.push(`<button${attributes(
    {
      class: `btn btn-${stringify(variant)} btn-${stringify(size)} ${stringify(className)}`,
      disabled: disabled || loading,
      ...rest
    },
    "svelte-1xko78n"
  )}>`);
  if (loading) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<span class="spinner svelte-1xko78n"></span>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--> `);
  children?.($$renderer);
  $$renderer.push(`<!----></button>`);
}
export {
  Button as B
};
