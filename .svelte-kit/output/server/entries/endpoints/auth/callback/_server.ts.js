import { redirect } from "@sveltejs/kit";
const GET = async ({ url, locals }) => {
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  if (code) {
    await locals.supabase.auth.exchangeCodeForSession(code);
  }
  throw redirect(303, next);
};
export {
  GET
};
