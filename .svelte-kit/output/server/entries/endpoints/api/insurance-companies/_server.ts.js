import { json } from "@sveltejs/kit";
import { z } from "zod";
const insuranceCompanySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  code: z.string().optional().nullable(),
  contact_email: z.string().email("Email inválido").optional().nullable().or(z.literal("")),
  contact_phone: z.string().optional().nullable(),
  website: z.string().url("URL inválida").optional().nullable().or(z.literal(""))
});
const GET = async ({ locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return new Response("No autenticado", { status: 401 });
  }
  try {
    const { data: userData } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
    if (!userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const { data: companies, error } = await supabase.from("insurance_companies").select("*").eq("company_id", userData.company_id).order("name", { ascending: true });
    if (error) {
      return json({ message: error.message }, { status: 400 });
    }
    return json({ companies: companies || [] });
  } catch (err) {
    return json({ message: err.message || "Error interno" }, { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return new Response("No autenticado", { status: 401 });
  }
  try {
    const body = await request.json();
    const validation = insuranceCompanySchema.safeParse(body);
    if (!validation.success) {
      return json(
        {
          message: "Datos inválidos",
          errors: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }
    const { data: userData } = await supabase.from("users").select("company_id, role").eq("id", session.user.id).single();
    if (!userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    if (userData.role !== "admin") {
      return json({ message: "Sin permisos para crear compañías de seguros" }, { status: 403 });
    }
    const { data: company, error } = await supabase.from("insurance_companies").insert({
      ...validation.data,
      company_id: userData.company_id,
      created_by: session.user.id
    }).select().single();
    if (error) {
      return json({ message: error.message }, { status: 400 });
    }
    return json({ company }, { status: 201 });
  } catch (err) {
    return json({ message: err.message || "Error interno" }, { status: 500 });
  }
};
export {
  GET,
  POST
};
