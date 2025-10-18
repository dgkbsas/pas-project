import { json } from "@sveltejs/kit";
const GET = async ({ params, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const policyId = params.id;
    const { data: followups, error } = await supabase.from("policy_followups").select("*").eq("policy_id", policyId).order("date", { ascending: false }).order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching followups:", error);
      return json({ message: "Error al obtener seguimientos" }, { status: 500 });
    }
    return json({ followups: followups || [] });
  } catch (err) {
    console.error("Error in GET /api/policies/[id]/followups:", err);
    return json({ message: "Error al obtener seguimientos" }, { status: 500 });
  }
};
const POST = async ({ params, request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const policyId = params.id;
    const body = await request.json();
    const { followup_type, date, description, status, alert_date } = body;
    if (!followup_type) {
      return json({ message: "El tipo de seguimiento es requerido" }, { status: 400 });
    }
    if (!date) {
      return json({ message: "La fecha es requerida" }, { status: 400 });
    }
    const { data: userData } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
    if (userData) {
      const company_id = userData.company_id;
      const { data: config } = await supabase.from("configuration").select("config_value").eq("company_id", company_id).eq("config_key", "followup_types").single();
      if (config && config.config_value) {
        const validTypes = config.config_value;
        if (!validTypes.includes(followup_type)) {
          return json(
            { message: `Tipo de seguimiento no válido. Tipos permitidos: ${validTypes.join(", ")}` },
            { status: 400 }
          );
        }
      }
    }
    const { data: followup, error: insertError } = await supabase.from("policy_followups").insert({
      policy_id: policyId,
      followup_type,
      date,
      description: description || null,
      status: status || null,
      alert_date: alert_date || null,
      created_by: session.user.id
    }).select().single();
    if (insertError) {
      console.error("Error creating followup:", insertError);
      if (insertError.code === "42501" || insertError.message?.includes("policy")) {
        return json({ message: "No tienes permiso para crear seguimientos en esta póliza" }, { status: 403 });
      }
      return json({ message: "Error al crear seguimiento" }, { status: 400 });
    }
    return json({ followup, message: "Seguimiento creado exitosamente" }, { status: 201 });
  } catch (err) {
    console.error("Error in POST /api/policies/[id]/followups:", err);
    return json({ message: "Error al crear seguimiento" }, { status: 500 });
  }
};
export {
  GET,
  POST
};
