import { error } from "@sveltejs/kit";
const load = async ({ locals }) => {
  const { supabase, session } = locals;
  if (!session) {
    throw error(401, "No autorizado");
  }
  const { data: userData, error: userError } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
  if (userError || !userData) {
    console.error("[NUEVA POLIZA] Error obteniendo usuario:", userError);
    throw error(404, "Usuario no encontrado");
  }
  const { data: clients, error: clientsError } = await supabase.from("clients").select("id, first_name, last_name").eq("company_id", userData.company_id).eq("active", true).order("first_name");
  if (clientsError) {
    console.error("[NUEVA POLIZA] Error al cargar clientes:", clientsError);
    throw error(500, "Error al cargar clientes");
  }
  return {
    clients: clients || []
  };
};
export {
  load
};
