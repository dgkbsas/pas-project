import { createServerClient } from "@supabase/ssr";
import { redirect } from "@sveltejs/kit";
const SUPABASE_URL = "https://cnwaaqvgwndsovmbchxp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNud2FhcXZnd25kc292bWJjaHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzg5MzIsImV4cCI6MjA3NTc1NDkzMn0.c68M6iloQdPKTg3QkofAREIn5n1wQ7kAg-Wnh1T_JlE";
const handle$1 = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: "/" });
        });
      }
    }
  });
  event.locals.safeGetSession = async () => {
    const {
      data: { user },
      error: userError
    } = await event.locals.supabase.auth.getUser();
    let session = null;
    if (user && !userError) {
      const { data } = await event.locals.supabase.auth.getSession();
      session = data.session;
    }
    return { session, user };
  };
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    }
  });
};
const handle = async ({ event, resolve }) => {
  return handle$1({ event, resolve: async (event2) => {
    const { session, user } = await event2.locals.safeGetSession();
    const isValidSession = session && session.expires_at && new Date(session.expires_at * 1e3) > /* @__PURE__ */ new Date();
    event2.locals.session = isValidSession ? session : null;
    event2.locals.user = isValidSession ? user : null;
    const path = event2.url.pathname;
    const publicRoutes = ["/", "/auth/login", "/auth/signup", "/auth/callback"];
    const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route + "/"));
    if (!isValidSession && !isPublicRoute && !path.startsWith("/api/")) {
      console.log("Redirecting to login - no valid session");
      throw redirect(303, "/auth/login");
    }
    if (isValidSession && (path === "/auth/login" || path === "/auth/signup")) {
      throw redirect(303, "/dashboard");
    }
    return resolve(event2);
  } });
};
export {
  handle
};
