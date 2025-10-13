import { json } from "@sveltejs/kit";
import { u as updateClientSchema } from "../../../../../chunks/clients.js";
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
  PUT
};
