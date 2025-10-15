import { $ as attributes, a0 as stringify, a5 as bind_props } from "./index2.js";
/* empty css                                    */
import { e as escape_html } from "./context.js";
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      type = "text",
      label,
      value = "",
      error = false,
      inputRef = void 0,
      class: className = "",
      children,
      $$slots,
      $$events,
      ...rest
    } = $$props;
    if (label) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<label class="input-label svelte-138axrz">${escape_html(label)} <input${attributes(
        {
          type,
          value,
          class: `input ${stringify(className)}`,
          ...rest
        },
        "svelte-138axrz",
        { error },
        void 0,
        4
      )}/></label>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<input${attributes(
        {
          type,
          value,
          class: `input ${stringify(className)}`,
          ...rest
        },
        "svelte-138axrz",
        { error },
        void 0,
        4
      )}/>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { value, inputRef });
  });
}
export {
  Input as I
};
