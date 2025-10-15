import { json } from "@sveltejs/kit";
import { u as updatePolicySchema } from "../../../../../chunks/policies.js";
const GET = async ({ params, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  const { id } = params;
  if (!session?.user) {
    return new Response("No autenticado", { status: 401 });
  }
  try {
    const { data: userData } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
    if (!userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const { data: policy, error: policyError } = await supabase.from("policies").select(`
				*,
				clients (
					id,
					first_name,
					last_name,
					email_primary,
					phone
				)
			`).eq("id", id).eq("company_id", userData.company_id).single();
    if (policyError || !policy) {
      return json({ message: "Póliza no encontrada" }, { status: 404 });
    }
    const policyData = policy;
    const clientData = policyData.clients;
    const formattedPolicy = {
      ...policyData,
      client: clientData,
      client_full_name: clientData ? `${clientData.first_name} ${clientData.last_name}` : null
    };
    delete formattedPolicy.clients;
    return json({ policy: formattedPolicy });
  } catch (err) {
    return json({ message: err.message || "Error interno" }, { status: 500 });
  }
};
const PUT = async ({ params, request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  const { id } = params;
  if (!session?.user) {
    return new Response("No autenticado", { status: 401 });
  }
  try {
    const body = await request.json();
    const validation = updatePolicySchema.safeParse(body);
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
    if (userData.role === "guest") {
      return json({ message: "Sin permisos para editar pólizas" }, { status: 403 });
    }
    const { data: policy, error } = await supabase.from("policies").update(validation.data).eq("id", id).eq("company_id", userData.company_id).select().single();
    if (error) {
      return json({ message: error.message }, { status: 400 });
    }
    if (!policy) {
      return json({ message: "Póliza no encontrada" }, { status: 404 });
    }
    return json({ policy });
  } catch (err) {
    return json({ message: err.message || "Error interno" }, { status: 500 });
  }
};
const DELETE = async ({ params, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  const { id } = params;
  if (!session?.user) {
    return new Response("No autenticado", { status: 401 });
  }
  try {
    const { data: userData } = await supabase.from("users").select("company_id, role").eq("id", session.user.id).single();
    if (!userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    if (userData.role !== "admin") {
      return json({ message: "Sin permisos para eliminar pólizas" }, { status: 403 });
    }
    const { error } = await supabase.from("policies").delete().eq("id", id).eq("company_id", userData.company_id);
    if (error) {
      return json({ message: error.message }, { status: 400 });
    }
    return new Response(null, { status: 204 });
  } catch (err) {
    return json({ message: err.message || "Error interno" }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  PUT
};
