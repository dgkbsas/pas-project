import { json } from "@sveltejs/kit";
import { z } from "zod";
const invitationCreateSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "agent", "guest"], {
    errorMap: () => ({ message: "Rol inválido" })
  }),
  company_id: z.string().uuid("ID de compañía inválido"),
  expires_in_days: z.number().int().min(1).max(60).default(7)
});
z.object({
  token: z.string().min(16, "Token inválido").max(256, "Token inválido")
});
z.object({
  token: z.string().min(16).max(256),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  full_name: z.string().min(1, "El nombre es requerido").optional()
});
const DELETE = async ({ request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return new Response("No autenticado", { status: 401 });
  }
  try {
    const { id } = await request.json();
    if (!id) {
      return new Response("ID requerido", { status: 400 });
    }
    const { data: userData } = await supabase.from("users").select("company_id, role").eq("id", session.user.id).single();
    if (!userData) {
      return new Response("Usuario no encontrado", { status: 404 });
    }
    if (userData.role !== "admin") {
      return new Response("Sin permisos", { status: 403 });
    }
    const { error } = await supabase.from("company_invitations").delete().eq("id", id).eq("company_id", userData.company_id);
    if (error) {
      return new Response(error.message, { status: 400 });
    }
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(err.message || "Error interno", { status: 500 });
  }
};
const GET = async ({ request, locals }) => {
  const supabase = locals.supabase;
  if (!locals.session) {
    return new Response("No autorizado", { status: 401 });
  }
  try {
    const { data, error } = await supabase.from("company_invitations").select("*").order("created_at", { ascending: false });
    if (error) {
      return new Response(error.message, { status: 400 });
    }
    return json(data);
  } catch (err) {
    return new Response(err.message || "Error interno", { status: 500 });
  }
};
const POST = async ({ request, locals, url }) => {
  const supabase = locals.supabase;
  if (!locals.session) {
    return new Response("No autorizado", { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = invitationCreateSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }
    const { email, role, company_id, expires_in_days } = parsed.data;
    const { data: tokenData, error: tokenErr } = await supabase.rpc(
      "generate_company_invite_token",
      { p_bytes: 24 }
    );
    if (tokenErr) {
      return new Response(tokenErr.message, { status: 400 });
    }
    const expires_at = new Date(Date.now() + expires_in_days * 864e5).toISOString();
    const { data, error } = await supabase.from("company_invitations").insert({
      company_id,
      email,
      role,
      token: tokenData,
      expires_at,
      created_by: locals.session.user.id
    }).select().single();
    if (error) {
      return new Response(error.message, { status: 400 });
    }
    const invitation_url = `${url.origin}/invite?token=${data.token}`;
    return json({
      ...data,
      invitation_url
    }, { status: 201 });
  } catch (err) {
    return new Response(err.message || "Error interno", { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST
};
