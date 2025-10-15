import { json } from "@sveltejs/kit";
import { c as clientSchema } from "../../../../chunks/clients.js";
const GET = async ({ url, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return new Response("No autenticado", { status: 401 });
  }
  try {
    const { data: userData } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
    if (!userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const search = url.searchParams.get("search") || "";
    const activeOnly = url.searchParams.get("active_only") === "true";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "30");
    const offset = (page - 1) * limit;
    const cities = url.searchParams.getAll("city");
    const hasEmail = url.searchParams.get("has_email");
    const hasPhone = url.searchParams.get("has_phone");
    const dateFrom = url.searchParams.get("date_from");
    const dateTo = url.searchParams.get("date_to");
    const sortBy = url.searchParams.get("sort_by") || "first_name";
    const sortOrder = url.searchParams.get("sort_order") || "asc";
    const ascending = sortOrder === "asc";
    const validSortFields = ["first_name", "last_name", "created_at", "updated_at", "policy_count"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "first_name";
    let query = supabase.from("clients").select("*", { count: "exact" }).eq("company_id", userData.company_id);
    if (activeOnly) {
      query = query.eq("active", true);
    }
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email_primary.ilike.%${search}%,phone.ilike.%${search}%`);
    }
    if (cities.length > 0) {
      query = query.in("city", cities);
    }
    if (hasEmail === "true") {
      query = query.not("email_primary", "is", null);
    } else if (hasEmail === "false") {
      query = query.is("email_primary", null);
    }
    if (hasPhone === "true") {
      query = query.not("phone", "is", null);
    } else if (hasPhone === "false") {
      query = query.is("phone", null);
    }
    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }
    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }
    if (sortField !== "policy_count") {
      query = query.order(sortField, { ascending });
    }
    query = query.range(offset, offset + limit - 1);
    const { data: clients, error, count } = await query;
    if (error) {
      return json({ message: error.message }, { status: 400 });
    }
    if (clients && clients.length > 0) {
      const clientIds = clients.map((c) => c.id);
      const { data: policyCounts } = await supabase.from("policies").select("client_id").in("client_id", clientIds).eq("active", true);
      const countsMap = /* @__PURE__ */ new Map();
      policyCounts?.forEach((p) => {
        countsMap.set(p.client_id, (countsMap.get(p.client_id) || 0) + 1);
      });
      clients.forEach((client) => {
        client.active_policies_count = countsMap.get(client.id) || 0;
      });
      if (sortField === "policy_count") {
        clients.sort((a, b) => {
          const countA = a.active_policies_count || 0;
          const countB = b.active_policies_count || 0;
          return ascending ? countA - countB : countB - countA;
        });
      }
    }
    return json({
      clients,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (err) {
    return json({ message: err.message || "Error interno" }, { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return new Response("No autenticado", { status: 401 });
  }
  try {
    const body = await request.json();
    const validation = clientSchema.safeParse(body);
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
      return json({ message: "Sin permisos para crear clientes" }, { status: 403 });
    }
    const { data: client, error } = await supabase.from("clients").insert({
      ...validation.data,
      company_id: userData.company_id,
      created_by: session.user.id,
      assigned_to: session.user.id
    }).select().single();
    if (error) {
      return json({ message: error.message }, { status: 400 });
    }
    return json({ client }, { status: 201 });
  } catch (err) {
    return json({ message: err.message || "Error interno" }, { status: 500 });
  }
};
export {
  GET,
  POST
};
