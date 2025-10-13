import { error } from "@sveltejs/kit";
const load = async ({ locals }) => {
  const { supabase, session } = locals;
  if (!session) {
    throw error(401, "No autorizado");
  }
  const { data: userData } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
  if (!userData) {
    throw error(404, "Usuario no encontrado");
  }
  const companyId = userData.company_id;
  const { data: company, error: companyError } = await supabase.from("companies").select("*").eq("id", companyId).single();
  const { data: users, error: usersError } = await supabase.from("users").select("id, email, role, created_at").eq("company_id", companyId).order("created_at", { ascending: false });
  const { data: invitations, error: invitationsError } = await supabase.from("invitations").select("*").eq("company_id", companyId).order("created_at", { ascending: false });
  return {
    user: session.user,
    company: company || null,
    users: users || [],
    invitations: invitations || []
  };
};
export {
  load
};
