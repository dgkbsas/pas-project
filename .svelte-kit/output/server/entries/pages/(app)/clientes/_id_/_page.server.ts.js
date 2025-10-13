import { error } from "@sveltejs/kit";
const load = async ({ params, locals }) => {
  const { supabase, session } = locals;
  if (!session) {
    throw error(401, "No autorizado");
  }
  const { data: userData } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
  if (!userData) {
    throw error(404, "Usuario no encontrado");
  }
  const companyId = userData.company_id;
  const { data: client, error: clientError } = await supabase.from("clients").select("*").eq("id", params.id).eq("company_id", companyId).single();
  if (clientError || !client) {
    throw error(404, "Cliente no encontrado");
  }
  const { data: policies, error: policiesError } = await supabase.from("policies").select("*").eq("client_id", params.id).eq("company_id", companyId).order("created_at", { ascending: false });
  return {
    client,
    policies: policies || []
  };
};
export {
  load
};
