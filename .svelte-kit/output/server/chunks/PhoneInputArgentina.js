import { V as attr_class, W as attr, a5 as bind_props } from "./index2.js";
/* empty css                                                  */
import { e as escape_html } from "./context.js";
function PhoneInputArgentina($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = "", error, disabled = false, required = false } = $$props;
    let areaCode = "";
    let phoneNumber = "";
    $$renderer2.push(`<div${attr_class("phone-input-argentina svelte-szsqhs", void 0, { "has-error": error })}><span class="prefix svelte-szsqhs">+54 9</span> <div class="input-group svelte-szsqhs"><input type="text" class="area-code-input svelte-szsqhs" placeholder="11"${attr("value", areaCode)}${attr("disabled", disabled, true)}${attr("required", required, true)} maxlength="4"/></div> <span class="prefix svelte-szsqhs">15</span> <div class="input-group svelte-szsqhs" style="width: 100%;"><input type="text" class="phone-number-input svelte-szsqhs" placeholder="1234-5678"${attr("value", phoneNumber)}${attr("disabled", disabled, true)}${attr("required", required, true)} maxlength="8"/></div> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="error-message svelte-szsqhs">${escape_html(error)}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
export {
  PhoneInputArgentina as P
};
