import { json } from "@sveltejs/kit";
import { S as SYSTEM_CONFIG_KEYS } from "../../../../../chunks/config.types.js";
const GET = async ({ params, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const configKey = params.key;
    if (!SYSTEM_CONFIG_KEYS.includes(configKey)) {
      return json({
        message: `Solo se permiten variables del sistema: ${SYSTEM_CONFIG_KEYS.join(", ")}`
      }, { status: 400 });
    }
    const { data: userData, error: userError } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
    if (userError || !userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const company_id = userData.company_id;
    const { data: config, error: configError } = await supabase.from("configuration").select("*").eq("company_id", company_id).eq("config_key", configKey).single();
    if (configError) {
      if (configError.code === "PGRST116") {
        return json({ message: "Configuración no encontrada" }, { status: 404 });
      }
      console.error("Error fetching config:", configError);
      return json({ message: "Error al obtener configuración" }, { status: 500 });
    }
    return json({ config });
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
    const configKey = params.key;
    const body = await request.json();
    const { config_value } = body;
    if (!SYSTEM_CONFIG_KEYS.includes(configKey)) {
      return json({
        message: `Solo se permiten variables del sistema: ${SYSTEM_CONFIG_KEYS.join(", ")}`
      }, { status: 400 });
    }
    if (config_value === void 0) {
      return json({ message: "config_value es requerido" }, { status: 400 });
    }
    const { data: userData, error: userError } = await supabase.from("users").select("company_id, role").eq("id", session.user.id).single();
    if (userError || !userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const { company_id, role } = userData;
    if (role !== "admin") {
      return json({ message: "Sin permisos para actualizar configuración" }, { status: 403 });
    }
    const { data: config, error: upsertError } = await supabase.from("configuration").upsert(
      {
        company_id,
        config_key: configKey,
        config_value,
        updated_by: session.user.id
      },
      {
        onConflict: "company_id,config_key"
      }
    ).select().single();
    if (upsertError) {
      console.error("Error upserting config:", upsertError);
      return json({ message: "Error al actualizar configuración" }, { status: 400 });
    }
    return json({ config, message: "Configuración actualizada exitosamente" });
  } catch (err) {
    console.error("Error in PUT /api/config/[key]:", err);
    return json({ message: "Error al actualizar configuración" }, { status: 500 });
  }
};
export {
  GET,
  PUT
};
