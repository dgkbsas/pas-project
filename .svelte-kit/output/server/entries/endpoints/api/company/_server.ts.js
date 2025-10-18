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
    const { data: company, error: companyError } = await supabase.from("companies").select("*").eq("id", company_id).single();
    if (companyError || !company) {
      return json({ message: "Empresa no encontrada" }, { status: 404 });
    }
    return json({ company });
  } catch (err) {
    console.error("Error fetching company:", err);
    return json({ message: "Error al obtener empresa" }, { status: 500 });
  }
};
const PUT = async ({ request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { data: userData, error: userError } = await supabase.from("users").select("company_id, role").eq("id", session.user.id).single();
    if (userError || !userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const { company_id, role } = userData;
    if (role !== "admin") {
      return json({ message: "Sin permisos para actualizar empresa" }, { status: 403 });
    }
    const allowedFields = ["name", "address", "city", "postal_code", "phone", "active"];
    const updates = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }
    if (Object.keys(updates).length === 0) {
      return json({ message: "No se proporcionaron campos para actualizar" }, { status: 400 });
    }
    updates.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    try {
      const { data: company, error: fetchError } = await supabase.from("companies").select("id").eq("id", company_id).single();
      if (fetchError || !company) {
        console.error("Company not found or access denied:", fetchError?.message);
        return json({
          message: "No se encontró la empresa o no tiene permisos para actualizarla",
          error: "Company not found or access denied"
        }, { status: 404 });
      }
      const { data: updatedCompany, error: updateError } = await supabase.from("companies").update(updates).eq("id", company_id).select().single();
      if (updateError) {
        console.error("Error updating company:", updateError);
        return json({
          message: "Error al actualizar la empresa",
          error: updateError.message
        }, { status: 400 });
      }
      if (!updatedCompany) {
        console.error("No data returned after update");
        return json({
          message: "Error al actualizar la empresa",
          error: "No se recibieron datos de la actualización"
        }, { status: 400 });
      }
      return json({
        company: updatedCompany,
        message: "Empresa actualizada exitosamente"
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      return json({
        message: "Error inesperado al procesar la solicitud",
        error: err.message
      }, { status: 500 });
    }
  } catch (err) {
    console.error("Error in PUT /api/company:", err);
    return json({ message: "Error al actualizar empresa" }, { status: 500 });
  }
};
export {
  GET,
  PUT
};
