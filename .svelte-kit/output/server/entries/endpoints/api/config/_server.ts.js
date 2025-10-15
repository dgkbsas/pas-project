import { json } from "@sveltejs/kit";
import { S as SYSTEM_CONFIG_KEYS } from "../../../../chunks/config.types.js";
const GET = async ({ locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const { data: userData, error: userError } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
    if (userError || !userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const company_id = userData.company_id;
    const { data: configs, error: configError } = await supabase.from("configuration").select("*").eq("company_id", company_id).order("config_key");
    if (configError) {
      console.error("Error fetching configs:", configError);
      return json({ message: "Error al obtener configuración" }, { status: 500 });
    }
    return json({ configs: configs || [] });
  } catch (err) {
    console.error("Error in GET /api/config:", err);
    return json({ message: "Error al obtener configuración" }, { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { config_key, config_value } = body;
    if (!config_key) {
      return json({ message: "config_key es requerido" }, { status: 400 });
    }
    if (!SYSTEM_CONFIG_KEYS.includes(config_key)) {
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
      return json({ message: "Sin permisos para crear configuración" }, { status: 403 });
    }
    const { data: existing } = await supabase.from("configuration").select("id").eq("company_id", company_id).eq("config_key", config_key).single();
    if (existing) {
      return json({ message: "Esta clave ya existe" }, { status: 400 });
    }
    const { data: config, error: insertError } = await supabase.from("configuration").insert({
      company_id,
      config_key,
      config_value: config_value || {},
      updated_by: session.user.id
    }).select().single();
    if (insertError) {
      console.error("Error creating config:", insertError);
      return json({ message: "Error al crear configuración" }, { status: 400 });
    }
    return json({ config, message: "Configuración creada exitosamente" }, { status: 201 });
  } catch (err) {
    console.error("Error in POST /api/config:", err);
    return json({ message: "Error al crear configuración" }, { status: 500 });
  }
};
export {
  GET,
  POST
};
