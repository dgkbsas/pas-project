import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (locals.session) {
    throw redirect(303, "/dashboard");
  }
  return {
    supabase: locals.supabase
  };
};
export {
  load
};
