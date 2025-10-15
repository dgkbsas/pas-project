import { json } from "@sveltejs/kit";
const PUT = async ({ params, request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const followupId = params.id;
    const body = await request.json();
    const allowedFields = ["followup_type", "date", "description", "status"];
    const updates = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }
    if (Object.keys(updates).length === 0) {
      return json({ message: "No se proporcionaron campos para actualizar" }, { status: 400 });
    }
    if (updates.followup_type) {
      const { data: userData } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
      if (userData) {
        const company_id = userData.company_id;
        const { data: config } = await supabase.from("configuration").select("config_value").eq("company_id", company_id).eq("config_key", "followup_types").single();
        if (config && config.config_value) {
          const validTypes = config.config_value;
          if (!validTypes.includes(updates.followup_type)) {
            return json(
              { message: `Tipo de seguimiento no válido. Tipos permitidos: ${validTypes.join(", ")}` },
              { status: 400 }
            );
          }
        }
      }
    }
    const { data: followup, error: updateError } = await supabase.from("policy_followups").update(updates).eq("id", followupId).select().single();
    if (updateError) {
      console.error("Error updating followup:", updateError);
      if (updateError.code === "42501" || updateError.message?.includes("policy")) {
        return json({ message: "No tienes permiso para actualizar este seguimiento" }, { status: 403 });
      }
      if (updateError.code === "PGRST116") {
        return json({ message: "Seguimiento no encontrado" }, { status: 404 });
      }
      return json({ message: "Error al actualizar seguimiento" }, { status: 400 });
    }
    return json({ followup, message: "Seguimiento actualizado exitosamente" });
  } catch (err) {
    console.error("Error in PUT /api/followups/[id]:", err);
    return json({ message: "Error al actualizar seguimiento" }, { status: 500 });
  }
};
const DELETE = async ({ params, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const followupId = params.id;
    const { error: deleteError } = await supabase.from("policy_followups").delete().eq("id", followupId);
    if (deleteError) {
      console.error("Error deleting followup:", deleteError);
      if (deleteError.code === "42501" || deleteError.message?.includes("policy")) {
        return json({ message: "No tienes permiso para eliminar este seguimiento" }, { status: 403 });
      }
      return json({ message: "Error al eliminar seguimiento" }, { status: 400 });
    }
    return json({ message: "Seguimiento eliminado exitosamente" }, { status: 200 });
  } catch (err) {
    console.error("Error in DELETE /api/followups/[id]:", err);
    return json({ message: "Error al eliminar seguimiento" }, { status: 500 });
  }
};
export {
  DELETE,
  PUT
};
