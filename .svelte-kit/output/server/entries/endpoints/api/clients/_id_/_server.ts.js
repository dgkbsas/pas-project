import { json } from "@sveltejs/kit";
import { u as updateClientSchema } from "../../../../../chunks/clients.js";
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
    const { data: client, error: clientError } = await supabase.from("clients").select("*").eq("id", id).eq("company_id", userData.company_id).single();
    if (clientError || !client) {
      return json({ message: "Cliente no encontrado" }, { status: 404 });
    }
    const { data: policies, error: policiesError } = await supabase.from("policies").select("id, policy_number, policy_type, insurer, active, start_date, expiry_date").eq("client_id", id).eq("company_id", userData.company_id).order("created_at", { ascending: false });
    if (policiesError) {
      console.error("Error fetching policies:", policiesError);
      return json({ client: { ...client, policies: [] } });
    }
    return json({ client: { ...client, policies: policies || [] } });
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
    const validation = updateClientSchema.safeParse(body);
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
      return json({ message: "Sin permisos para editar clientes" }, { status: 403 });
    }
    const { data: client, error } = await supabase.from("clients").update(validation.data).eq("id", id).eq("company_id", userData.company_id).select().single();
    if (error) {
      return json({ message: error.message }, { status: 400 });
    }
    if (!client) {
      return json({ message: "Cliente no encontrado" }, { status: 404 });
    }
    return json({ client });
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
      return json({ message: "Sin permisos para eliminar clientes" }, { status: 403 });
    }
    const { count: policiesCount } = await supabase.from("policies").select("*", { count: "exact", head: true }).eq("client_id", id);
    if (policiesCount && policiesCount > 0) {
      return json(
        {
          message: `No se puede eliminar. El cliente tiene ${policiesCount} póliza(s) asociada(s)`
        },
        { status: 400 }
      );
    }
    const { error } = await supabase.from("clients").delete().eq("id", id).eq("company_id", userData.company_id);
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
