import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  const session = locals.session;
  if (!session) {
    throw redirect(303, "/auth/login");
  }
  const { data: userProfile } = await locals.supabase.from("users").select("id, email, full_name, company_id, role").eq("id", session.user.id).single();
  return {
    session,
    userProfile
  };
};
export {
  load
};
