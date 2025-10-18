import { W as attr, a0 as stringify, Y as ensure_array_like, a5 as bind_props } from "./index2.js";
import { e as escape_html } from "./context.js";
function Select($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      label,
      error,
      options = [],
      value = "",
      class: className = "",
      id,
      children,
      $$slots,
      $$events,
      ...rest
    } = $$props;
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    if (label) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<label${attr("for", inputId)} class="label svelte-gjx2ev">${escape_html(label)}</label>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    $$renderer2.select(
      {
        id,
        class: `select ${stringify(className)}`,
        value,
        ...rest
      },
      ($$renderer3) => {
        if (children) {
          $$renderer3.push("<!--[-->");
          children($$renderer3);
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(options);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let option = each_array[$$index];
            $$renderer3.option(
              { value: option.value, class: "" },
              ($$renderer4) => {
                $$renderer4.push(`${escape_html(option.label)}`);
              },
              "svelte-gjx2ev"
            );
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-gjx2ev",
      { error }
    );
    $$renderer2.push(` `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="error-message svelte-gjx2ev">${escape_html(error)}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { value });
  });
}
export {
  Select as S
};
