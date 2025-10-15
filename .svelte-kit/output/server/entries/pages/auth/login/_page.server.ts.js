import { redirect, fail } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (locals.session) {
    throw redirect(303, "/dashboard");
  }
  return {};
};
const actions = {
  login: async ({ request, locals }) => {
    console.log("[LOGIN ACTION] Iniciando login...");
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    console.log("[LOGIN ACTION] Email:", email);
    if (!email || !password) {
      console.log("[LOGIN ACTION] Faltan campos");
      return fail(400, {
        message: "Por favor completa todos los campos",
        email
      });
    }
    console.log("[LOGIN ACTION] Intentando autenticar con Supabase...");
    const { data, error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.error("[LOGIN ACTION] Error de autenticación:", error);
      return fail(401, {
        message: error.message || "Credenciales inválidas",
        email
      });
    }
    console.log("[LOGIN ACTION] Login exitoso, sesión creada:", data.session ? "SI" : "NO");
    console.log("[LOGIN ACTION] Access token presente:", !!data.session?.access_token);
    console.log("[LOGIN ACTION] Expires at:", data.session?.expires_at);
    locals.supabase.auth.getSession();
    console.log("[LOGIN ACTION] Verificando cookies después de login...");
    return { success: true };
  }
};
export {
  actions,
  load
};
