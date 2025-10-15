import { a5 as bind_props, Y as ensure_array_like, a6 as head } from "../../../../../chunks/index2.js";
import { g as goto } from "../../../../../chunks/client.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { e as escape_html } from "../../../../../chunks/context.js";
import "clsx";
import { I as Input } from "../../../../../chunks/Input.js";
import { C as Card } from "../../../../../chunks/Card.js";
/* empty css                                                             */
import { P as PhoneInputArgentina } from "../../../../../chunks/PhoneInputArgentina.js";
import { S as Save } from "../../../../../chunks/save.js";
import "../../../../../chunks/notifications.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
function AddressAutocompleteNominatim($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = "",
      street = "",
      streetNumber = "",
      floor = "",
      apartment = "",
      city = "",
      province = "",
      postalCode = "",
      country = "",
      placeholder = "Ingrese dirección",
      error,
      disabled = false,
      onAddressSelect
    } = $$props;
    let suggestions = [];
    let showSuggestions = false;
    let loading = false;
    let searchTimeout;
    async function searchAddress(query) {
      if (query.length < 3) {
        suggestions = [];
        showSuggestions = false;
        return;
      }
      loading = true;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` + new URLSearchParams({
            q: query,
            format: "json",
            addressdetails: "1",
            countrycodes: "ar",
            // Restringir a Argentina
            limit: "5"
          }),
          { headers: { "Accept-Language": "es-AR,es;q=0.9" } }
        );
        if (response.ok) {
          const results = await response.json();
          suggestions = results;
          showSuggestions = results.length > 0;
        }
      } catch (err) {
        console.error("Error searching address:", err);
        suggestions = [];
      } finally {
        loading = false;
      }
    }
    function handleInput(e) {
      const target = e.target;
      value = target.value;
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(
        () => {
          searchAddress(value);
        },
        300
      );
    }
    function handleBlur() {
      setTimeout(
        () => {
          showSuggestions = false;
        },
        200
      );
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="address-autocomplete-nominatim svelte-zdghnh"><div class="search-container svelte-zdghnh">`);
      Input($$renderer3, {
        placeholder,
        error,
        disabled,
        autocomplete: "off",
        oninput: handleInput,
        onblur: handleBlur,
        onfocus: () => value.length >= 3 && suggestions.length > 0 && (showSuggestions = true),
        get value() {
          return value;
        },
        set value($$value) {
          value = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (loading) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="loading-indicator svelte-zdghnh">Buscando...</div>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (showSuggestions && suggestions.length > 0) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="suggestions-dropdown svelte-zdghnh"><!--[-->`);
        const each_array = ensure_array_like(suggestions);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let suggestion = each_array[$$index];
          $$renderer3.push(`<button type="button" class="suggestion-item svelte-zdghnh"><div class="suggestion-main svelte-zdghnh">${escape_html(suggestion.address?.road || suggestion.address?.suburb || "")} `);
          if (suggestion.address?.house_number) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`${escape_html(suggestion.address.house_number)}`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div> <div class="suggestion-detail svelte-zdghnh">${escape_html(suggestion.address?.city || suggestion.address?.town || "")} `);
          if (suggestion.address?.state) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`, ${escape_html(suggestion.address.state)}`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div></button>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="help-text svelte-zdghnh">💡 Autocompletado gratuito con OpenStreetMap. Los datos pueden no ser
    exactos, verifica y corrige si es necesario.</div> <div class="address-fields-grid svelte-zdghnh"><div class="field-group svelte-zdghnh"><label for="street" class="svelte-zdghnh">Calle</label> `);
      Input($$renderer3, {
        id: "street",
        placeholder: "Nombre de la calle",
        disabled,
        get value() {
          return street;
        },
        set value($$value) {
          street = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="field-group svelte-zdghnh"><label for="streetNumber" class="svelte-zdghnh">Número</label> `);
      Input($$renderer3, {
        id: "streetNumber",
        placeholder: "1234",
        disabled,
        get value() {
          return streetNumber;
        },
        set value($$value) {
          streetNumber = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="field-group svelte-zdghnh"><label for="floor" class="svelte-zdghnh">Piso</label> `);
      Input($$renderer3, {
        id: "floor",
        placeholder: "5",
        disabled,
        get value() {
          return floor;
        },
        set value($$value) {
          floor = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="field-group svelte-zdghnh"><label for="apartment" class="svelte-zdghnh">Depto</label> `);
      Input($$renderer3, {
        id: "apartment",
        placeholder: "A",
        disabled,
        get value() {
          return apartment;
        },
        set value($$value) {
          apartment = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="field-group svelte-zdghnh"><label for="city" class="svelte-zdghnh">Ciudad</label> `);
      Input($$renderer3, {
        id: "city",
        placeholder: "Ciudad",
        disabled,
        get value() {
          return city;
        },
        set value($$value) {
          city = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="field-group svelte-zdghnh"><label for="province" class="svelte-zdghnh">Provincia</label> `);
      Input($$renderer3, {
        id: "province",
        placeholder: "Provincia",
        disabled,
        get value() {
          return province;
        },
        set value($$value) {
          province = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div class="field-group svelte-zdghnh"><label for="postalCode" class="svelte-zdghnh">Código Postal</label> `);
      Input($$renderer3, {
        id: "postalCode",
        placeholder: "1234",
        disabled,
        get value() {
          return postalCode;
        },
        set value($$value) {
          postalCode = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, {
      value,
      street,
      streetNumber,
      floor,
      apartment,
      city,
      province,
      postalCode,
      country
    });
  });
}
function ClientForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      mode = "create",
      initialData = {},
      loading = false,
      errors = {},
      onCancel
    } = $$props;
    let formData = {
      first_name: initialData.first_name || "",
      last_name: initialData.last_name || "",
      document_number: initialData.document_number || "",
      birth_date: initialData.birth_date || "",
      email_primary: initialData.email_primary || "",
      email_secondary: initialData.email_secondary || "",
      phone: initialData.phone || "",
      phone_landline: initialData.phone_landline || "",
      address: initialData.address || "",
      street: initialData.street || "",
      street_number: initialData.street_number || "",
      floor: initialData.floor || "",
      apartment: initialData.apartment || "",
      city: initialData.city || "",
      province: initialData.province || "",
      postal_code: initialData.postal_code || "",
      alias_pas: initialData.alias_pas || "",
      referred_by: initialData.referred_by || "",
      observations: initialData.observations || ""
    };
    function handleAddressSelect(address) {
      const parts = [
        address.street,
        address.streetNumber,
        address.floor && `Piso ${address.floor}`,
        address.apartment && `Depto ${address.apartment}`
      ].filter(Boolean);
      formData.address = parts.join(" ");
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<form class="svelte-vs637i">`);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-vs637i"><h2 class="svelte-vs637i">Información Personal</h2></div> <div class="form-grid svelte-vs637i"><div class="form-group svelte-vs637i"><label for="first_name" class="svelte-vs637i">Nombre <span class="required svelte-vs637i">*</span></label> `);
          Input($$renderer4, {
            id: "first_name",
            placeholder: "Ej: Juan",
            error: errors.first_name,
            required: true,
            get value() {
              return formData.first_name;
            },
            set value($$value) {
              formData.first_name = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-vs637i"><label for="last_name" class="svelte-vs637i">Apellido <span class="required svelte-vs637i">*</span></label> `);
          Input($$renderer4, {
            id: "last_name",
            placeholder: "Ej: Pérez García",
            error: errors.last_name,
            required: true,
            get value() {
              return formData.last_name;
            },
            set value($$value) {
              formData.last_name = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-vs637i"><label for="document_number" class="svelte-vs637i">DNI/CUIT</label> `);
          Input($$renderer4, {
            id: "document_number",
            placeholder: "12345678",
            error: errors.document_number,
            get value() {
              return formData.document_number;
            },
            set value($$value) {
              formData.document_number = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-vs637i"><label for="birth_date" class="svelte-vs637i">Fecha de Nacimiento</label> `);
          Input($$renderer4, {
            id: "birth_date",
            type: "date",
            error: errors.birth_date,
            get value() {
              return formData.birth_date;
            },
            set value($$value) {
              formData.birth_date = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-vs637i"><label for="email_primary" class="svelte-vs637i">Email Principal</label> `);
          Input($$renderer4, {
            id: "email_primary",
            type: "email",
            placeholder: "ejemplo@email.com",
            error: errors.email_primary,
            get value() {
              return formData.email_primary;
            },
            set value($$value) {
              formData.email_primary = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-vs637i"><label for="email_secondary" class="svelte-vs637i">Email Secundario</label> `);
          Input($$renderer4, {
            id: "email_secondary",
            type: "email",
            placeholder: "secundario@email.com",
            error: errors.email_secondary,
            get value() {
              return formData.email_secondary;
            },
            set value($$value) {
              formData.email_secondary = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-vs637i"><label for="phone" class="svelte-vs637i">Celular (ARG)</label> `);
          PhoneInputArgentina($$renderer4, {
            error: errors.phone,
            get value() {
              return formData.phone;
            },
            set value($$value) {
              formData.phone = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-vs637i"><label for="phone_landline" class="svelte-vs637i">Teléfono</label> `);
          Input($$renderer4, {
            id: "phone_landline",
            type: "tel",
            placeholder: "011 1234-5678",
            error: errors.phone_landline,
            get value() {
              return formData.phone_landline;
            },
            set value($$value) {
              formData.phone_landline = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-vs637i"><h2 class="svelte-vs637i">Dirección</h2> <p class="card-description svelte-vs637i">Usa el autocompletado para buscar la dirección</p></div> `);
          AddressAutocompleteNominatim($$renderer4, {
            placeholder: "Buscar dirección en Argentina...",
            onAddressSelect: handleAddressSelect,
            get value() {
              return formData.address;
            },
            set value($$value) {
              formData.address = $$value;
              $$settled = false;
            },
            get street() {
              return formData.street;
            },
            set street($$value) {
              formData.street = $$value;
              $$settled = false;
            },
            get streetNumber() {
              return formData.street_number;
            },
            set streetNumber($$value) {
              formData.street_number = $$value;
              $$settled = false;
            },
            get floor() {
              return formData.floor;
            },
            set floor($$value) {
              formData.floor = $$value;
              $$settled = false;
            },
            get apartment() {
              return formData.apartment;
            },
            set apartment($$value) {
              formData.apartment = $$value;
              $$settled = false;
            },
            get city() {
              return formData.city;
            },
            set city($$value) {
              formData.city = $$value;
              $$settled = false;
            },
            get province() {
              return formData.province;
            },
            set province($$value) {
              formData.province = $$value;
              $$settled = false;
            },
            get postalCode() {
              return formData.postal_code;
            },
            set postalCode($$value) {
              formData.postal_code = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!---->`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-vs637i"><h2 class="svelte-vs637i">Información Adicional</h2></div> <div class="form-grid svelte-vs637i"><div class="form-group svelte-vs637i"><label for="alias_pas" class="svelte-vs637i">Alias PAS</label> `);
          Input($$renderer4, {
            id: "alias_pas",
            placeholder: "Alias o apodo del cliente",
            error: errors.alias_pas,
            get value() {
              return formData.alias_pas;
            },
            set value($$value) {
              formData.alias_pas = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-vs637i"><label for="referred_by" class="svelte-vs637i">Referido Por</label> `);
          Input($$renderer4, {
            id: "referred_by",
            placeholder: "¿Quién lo refirió?",
            error: errors.referred_by,
            get value() {
              return formData.referred_by;
            },
            set value($$value) {
              formData.referred_by = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-vs637i"><h2 class="svelte-vs637i">Observaciones</h2></div> <div class="form-group svelte-vs637i"><label for="observations" class="svelte-vs637i">Observaciones</label> <textarea id="observations" placeholder="Información adicional sobre el cliente..." rows="4" class="svelte-vs637i">`);
          const $$body = escape_html(formData.observations);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea></div>`);
        }
      });
      $$renderer3.push(`<!----> <div class="form-actions svelte-vs637i">`);
      Button($$renderer3, {
        type: "button",
        variant: "outline",
        onclick: onCancel,
        disabled: loading,
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Cancelar`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Button($$renderer3, {
        type: "submit",
        variant: "primary",
        disabled: loading,
        children: ($$renderer4) => {
          Save($$renderer4, { size: 18 });
          $$renderer4.push(`<!----> ${escape_html(loading ? "Guardando..." : mode === "create" ? "Guardar Cliente" : "Guardar Cambios")}`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></form>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let loading = false;
    let errors = {};
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Nuevo Cliente - PAS Manager</title>`);
      });
    });
    $$renderer2.push(`<div class="page svelte-4sno3x"><div class="page-header svelte-4sno3x"><div class="svelte-4sno3x">`);
    Button($$renderer2, {
      variant: "ghost",
      size: "sm",
      onclick: () => goto(),
      children: ($$renderer3) => {
        Arrow_left($$renderer3, { size: 18 });
        $$renderer3.push(`<!----> Volver`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <h1 class="svelte-4sno3x">Nuevo Cliente</h1> <p class="svelte-4sno3x">Completa los datos para registrar un nuevo cliente</p></div></div> `);
    ClientForm($$renderer2, {
      mode: "create",
      loading,
      errors,
      onCancel: () => goto()
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};
