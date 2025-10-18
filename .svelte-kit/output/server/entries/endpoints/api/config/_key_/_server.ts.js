import { json } from "@sveltejs/kit";
const ARRAY_CONFIG_KEYS = [
  "payment_modes",
  "policy_types",
  "followup_types"
];
function generateConfigKey(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
const GET = async ({ params, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const fieldKey = params.key;
    const { data: userData, error: userError } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
    if (userError || !userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const company_id = userData.company_id;
    const { data: config, error: configError } = await supabase.from("company_config").select(fieldKey).eq("company_id", company_id).single();
    if (configError) {
      console.error("Error fetching config field:", configError);
      return json({ message: "Error al obtener configuración" }, { status: 500 });
    }
    return json({ value: config[fieldKey] });
  } catch (err) {
    console.error("Error in GET /api/config/[key]:", err);
    return json({ message: "Error al obtener configuración" }, { status: 500 });
  }
};
const PUT = async ({ params, request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const fieldKey = params.key;
    const body = await request.json();
    const { value } = body;
    if (value === void 0) {
      return json({ message: "value es requerido" }, { status: 400 });
    }
    const { data: userData, error: userError } = await supabase.from("users").select("company_id, role").eq("id", session.user.id).single();
    if (userError || !userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const { company_id, role } = userData;
    if (role !== "admin") {
      return json({ message: "Sin permisos para actualizar configuración" }, { status: 403 });
    }
    const { data: config, error: updateError } = await supabase.from("company_config").update({
      [fieldKey]: value,
      updated_by: session.user.id
    }).eq("company_id", company_id).select().single();
    if (updateError) {
      console.error("Error updating config field:", updateError);
      return json({ message: "Error al actualizar configuración" }, { status: 400 });
    }
    return json({ config, message: "Configuración actualizada exitosamente" });
  } catch (err) {
    console.error("Error in PUT /api/config/[key]:", err);
    return json({ message: "Error al actualizar configuración" }, { status: 500 });
  }
};
const POST = async ({ params, request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const fieldKey = params.key;
    const body = await request.json();
    const { value, key, active = true } = body;
    if (!ARRAY_CONFIG_KEYS.includes(fieldKey)) {
      return json({
        message: `Solo se pueden agregar items a: ${ARRAY_CONFIG_KEYS.join(", ")}`
      }, { status: 400 });
    }
    if (!value) {
      return json({ message: "value (label) es requerido" }, { status: 400 });
    }
    const { data: userData, error: userError } = await supabase.from("users").select("company_id, role").eq("id", session.user.id).single();
    if (userError || !userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const { company_id, role } = userData;
    if (role !== "admin") {
      return json({ message: "Sin permisos para modificar configuración" }, { status: 403 });
    }
    const { data: currentConfig, error: fetchError } = await supabase.from("company_config").select(fieldKey).eq("company_id", company_id).single();
    if (fetchError) {
      console.error("Error fetching current config:", fetchError);
      return json({ message: "Error al obtener configuración actual" }, { status: 500 });
    }
    const currentItems = currentConfig[fieldKey] || [];
    const itemKey = key || generateConfigKey(value);
    const existingIndex = currentItems.findIndex((item) => item.key === itemKey);
    let updatedItems;
    if (existingIndex >= 0) {
      updatedItems = currentItems.map(
        (item, index) => index === existingIndex ? { ...item, value, active } : item
      );
    } else {
      updatedItems = [...currentItems, { key: itemKey, value, active }];
    }
    const { data: config, error: updateError } = await supabase.from("company_config").update({
      [fieldKey]: updatedItems,
      updated_by: session.user.id
    }).eq("company_id", company_id).select().single();
    if (updateError) {
      console.error("Error updating config:", updateError);
      return json({ message: "Error al actualizar configuración" }, { status: 400 });
    }
    return json({
      config,
      item: updatedItems.find((i) => i.key === itemKey),
      message: existingIndex >= 0 ? "Item actualizado exitosamente" : "Item agregado exitosamente"
    });
  } catch (err) {
    console.error("Error in POST /api/config/[key]:", err);
    return json({ message: "Error al agregar item" }, { status: 500 });
  }
};
const DELETE = async ({ params, url, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const fieldKey = params.key;
    const itemKey = url.searchParams.get("itemKey");
    if (!ARRAY_CONFIG_KEYS.includes(fieldKey)) {
      return json({
        message: `Solo se pueden eliminar items de: ${ARRAY_CONFIG_KEYS.join(", ")}`
      }, { status: 400 });
    }
    if (!itemKey) {
      return json({ message: "itemKey es requerido como query param" }, { status: 400 });
    }
    const { data: userData, error: userError } = await supabase.from("users").select("company_id, role").eq("id", session.user.id).single();
    if (userError || !userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const { company_id, role } = userData;
    if (role !== "admin") {
      return json({ message: "Sin permisos para modificar configuración" }, { status: 403 });
    }
    const { data: currentConfig, error: fetchError } = await supabase.from("company_config").select(fieldKey).eq("company_id", company_id).single();
    if (fetchError) {
      console.error("Error fetching current config:", fetchError);
      return json({ message: "Error al obtener configuración actual" }, { status: 500 });
    }
    const currentItems = currentConfig[fieldKey] || [];
    const itemIndex = currentItems.findIndex((item) => item.key === itemKey);
    if (itemIndex === -1) {
      return json({ message: "Item no encontrado" }, { status: 404 });
    }
    const updatedItems = currentItems.map(
      (item, index) => index === itemIndex ? { ...item, active: !item.active } : item
    );
    const { data: config, error: updateError } = await supabase.from("company_config").update({
      [fieldKey]: updatedItems,
      updated_by: session.user.id
    }).eq("company_id", company_id).select().single();
    if (updateError) {
      console.error("Error updating config:", updateError);
      return json({ message: "Error al actualizar configuración" }, { status: 400 });
    }
    const wasActive = currentItems[itemIndex].active;
    return json({
      config,
      message: wasActive ? "Item desactivado exitosamente" : "Item activado exitosamente"
    });
  } catch (err) {
    console.error("Error in DELETE /api/config/[key]:", err);
    return json({ message: "Error al eliminar item" }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST,
  PUT
};
