import { json } from "@sveltejs/kit";
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
    const { data: config, error: configError } = await supabase.from("company_config").select("*").eq("company_id", company_id).single();
    if (configError) {
      if (configError.code === "PGRST116") {
        const { data: newConfig, error: insertError } = await supabase.from("company_config").insert({ company_id }).select().single();
        if (insertError) {
          console.error("Error creating default config:", insertError);
          return json({ message: "Error al crear configuración" }, { status: 500 });
        }
        return json({ config: newConfig });
      }
      console.error("Error fetching config:", configError);
      return json({ message: "Error al obtener configuración" }, { status: 500 });
    }
    return json({ config });
  } catch (err) {
    console.error("Error in GET /api/config:", err);
    return json({ message: "Error al obtener configuración" }, { status: 500 });
  }
};
const PATCH = async ({ request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const updates = await request.json();
    const { data: userData, error: userError } = await supabase.from("users").select("company_id, role").eq("id", session.user.id).single();
    if (userError || !userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const { company_id, role } = userData;
    if (role !== "admin") {
      return json({ message: "Sin permisos para actualizar configuración" }, { status: 403 });
    }
    const { data: config, error: updateError } = await supabase.from("company_config").update({
      ...updates,
      updated_by: session.user.id
    }).eq("company_id", company_id).select().single();
    if (updateError) {
      console.error("Error updating config:", updateError);
      return json({ message: "Error al actualizar configuración" }, { status: 400 });
    }
    return json({ config, message: "Configuración actualizada exitosamente" });
  } catch (err) {
    console.error("Error in PATCH /api/config:", err);
    return json({ message: "Error al actualizar configuración" }, { status: 500 });
  }
};
export {
  GET,
  PATCH
};
