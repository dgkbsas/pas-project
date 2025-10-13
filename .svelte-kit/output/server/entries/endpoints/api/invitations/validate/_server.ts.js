import { json } from "@sveltejs/kit";
const POST = async ({ request, locals }) => {
  const supabase = locals.supabase;
  try {
    const { token } = await request.json();
    if (!token) {
      return json({ message: "Token requerido" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("invitation_token_status", {
      p_token: token
    });
    if (error) {
      return json({ message: error.message }, { status: 400 });
    }
    if (!data || data.length === 0) {
      return json({ message: "Invitación no encontrada" }, { status: 404 });
    }
    const invitation = data[0];
    if (!invitation.valid) {
      return json(
        {
          valid: false,
          reason: invitation.reason,
          message: invitation.reason === "used" ? "Esta invitación ya ha sido utilizada" : invitation.reason === "expired" ? "Esta invitación ha expirado" : "Invitación no válida"
        },
        { status: 410 }
        // Gone
      );
    }
    const { data: companyData } = await supabase.from("companies").select("name, company_name").eq("id", invitation.company_id).single();
    return json({
      valid: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expires_at: invitation.expires_at,
        company: {
          id: invitation.company_id,
          name: companyData?.company_name || companyData?.name || "Empresa"
        }
      }
    });
  } catch (err) {
    return json({ message: err.message || "Error interno" }, { status: 500 });
  }
};
export {
  POST
};
