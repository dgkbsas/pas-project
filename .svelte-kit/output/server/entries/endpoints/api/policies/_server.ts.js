import { json } from "@sveltejs/kit";
import { p as policyFilterSchema, a as policySchema } from "../../../../chunks/policies.js";
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
    const policyTypes = url.searchParams.getAll("policy_type");
    const paymentModes = url.searchParams.getAll("payment_mode");
    const insurers = url.searchParams.getAll("insurer");
    const filters = {
      client_id: url.searchParams.get("client_id") || void 0,
      status: url.searchParams.get("status") || void 0,
      policy_type: policyTypes.length > 0 ? policyTypes : url.searchParams.get("policy_type") || void 0,
      payment_mode: paymentModes.length > 0 ? paymentModes : void 0,
      insurer: insurers.length > 0 ? insurers : void 0,
      search: url.searchParams.get("search") || void 0,
      active_only: url.searchParams.get("active_only") === "true",
      sortBy: url.searchParams.get("sortBy") || "created_at",
      sortOrder: url.searchParams.get("sortOrder") || "desc",
      page: parseInt(url.searchParams.get("page") || "1"),
      limit: parseInt(url.searchParams.get("limit") || "30")
    };
    const validation = policyFilterSchema.safeParse(filters);
    if (!validation.success) {
      return json(
        { message: "Filtros inválidos", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { page, limit, search, client_id, status, policy_type, payment_mode, insurer, active_only, sortBy, sortOrder } = validation.data;
    const offset = (page - 1) * limit;
    let query = supabase.from("policies").select(
      `
				*,
				client:clients (
					id,
					first_name,
					last_name,
					email_primary,
					phone
				)
			`,
      { count: "exact" }
    ).eq("company_id", userData.company_id);
    if (search) {
      query = query.or(`policy_number.ilike.%${search}%,policy_type.ilike.%${search}%,vehicle_plate.ilike.%${search}%`);
    }
    if (client_id) {
      query = query.eq("client_id", client_id);
    }
    if (status) {
      if (status === "active") {
        query = query.eq("active", true);
      } else if (status === "inactive") {
        query = query.eq("active", false);
      } else if (status === "expiring_soon") {
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const futureDate = /* @__PURE__ */ new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const future = futureDate.toISOString().split("T")[0];
        query = query.eq("active", true).gte("expiry_date", today).lte("expiry_date", future);
      }
    }
    if (policy_type) {
      if (Array.isArray(policy_type) && policy_type.length > 0) {
        query = query.in("policy_type", policy_type);
      } else if (typeof policy_type === "string") {
        query = query.eq("policy_type", policy_type);
      }
    }
    if (payment_mode && Array.isArray(payment_mode) && payment_mode.length > 0) {
      query = query.in("payment_mode", payment_mode);
    }
    if (insurer && Array.isArray(insurer) && insurer.length > 0) {
      query = query.in("insurer", insurer);
    }
    if (active_only) {
      query = query.eq("active", true);
    }
    const ascending = sortOrder === "asc";
    query = query.order(sortBy || "created_at", { ascending });
    query = query.range(offset, offset + limit - 1);
    const { data: policies, error, count } = await query;
    if (error) {
      return json({ message: error.message }, { status: 400 });
    }
    return json({
      policies,
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
    console.log("POST /api/policies - Request body:", JSON.stringify(body, null, 2));
    const validation = policySchema.safeParse(body);
    if (!validation.success) {
      console.error("Validation failed:", validation.error.flatten());
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
      return json({ message: "Sin permisos para crear pólizas" }, { status: 403 });
    }
    const { data: client } = await supabase.from("clients").select("id").eq("id", validation.data.client_id).eq("company_id", userData.company_id).single();
    if (!client) {
      return json({ message: "Cliente no encontrado" }, { status: 404 });
    }
    const { data: policy, error } = await supabase.from("policies").insert({
      ...validation.data,
      company_id: userData.company_id,
      created_by: session.user.id
    }).select().single();
    if (error) {
      console.error("Database error creating policy:", error);
      return json({ message: error.message }, { status: 400 });
    }
    return json({ policy }, { status: 201 });
  } catch (err) {
    console.error("Error in POST /api/policies:", err);
    return json({ message: err.message || "Error interno" }, { status: 500 });
  }
};
export {
  GET,
  POST
};
