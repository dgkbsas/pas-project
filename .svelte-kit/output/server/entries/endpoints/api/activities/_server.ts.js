import { json } from "@sveltejs/kit";
const GET = async ({ url, locals }) => {
  try {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return json({ error: "No autenticado" }, { status: 401 });
    }
    const { data: userProfile } = await locals.supabase.from("users").select("company_id").eq("id", user.id).single();
    if (!userProfile) {
      return json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    const company_id = userProfile.company_id;
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "30");
    const sortBy = url.searchParams.get("sortBy") || "date";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const typeFilters = url.searchParams.getAll("type");
    const dateFrom = url.searchParams.get("date_from");
    const dateTo = url.searchParams.get("date_to");
    const offset = (page - 1) * limit;
    const activities = [];
    if (typeFilters.length === 0 || typeFilters.includes("client")) {
      let clientQuery = locals.supabase.from("clients").select("id, first_name, last_name, created_at, updated_at").eq("company_id", company_id).eq("active", true).order("updated_at", { ascending: sortOrder === "asc" });
      if (dateFrom) {
        clientQuery = clientQuery.gte("updated_at", dateFrom);
      }
      if (dateTo) {
        clientQuery = clientQuery.lte("updated_at", dateTo);
      }
      const { data: clients } = await clientQuery;
      if (clients) {
        clients.forEach((client) => {
          activities.push({
            id: `client-${client.id}`,
            type: "client",
            title: "Cliente actualizado",
            description: `${client.first_name} ${client.last_name}`,
            date: client.updated_at,
            entity_id: client.id,
            entity_name: `${client.first_name} ${client.last_name}`
          });
        });
      }
    }
    if (typeFilters.length === 0 || typeFilters.includes("policy")) {
      let policyQuery = locals.supabase.from("policies").select(`
          id,
          policy_number,
          policy_type,
          created_at,
          updated_at,
          clients:client_id (
            first_name,
            last_name
          )
        `).eq("company_id", company_id).eq("active", true).order("updated_at", { ascending: sortOrder === "asc" });
      if (dateFrom) {
        policyQuery = policyQuery.gte("updated_at", dateFrom);
      }
      if (dateTo) {
        policyQuery = policyQuery.lte("updated_at", dateTo);
      }
      const { data: policies } = await policyQuery;
      if (policies) {
        policies.forEach((policy) => {
          const clientName = policy.clients ? `${policy.clients.first_name} ${policy.clients.last_name}` : "Cliente desconocido";
          activities.push({
            id: `policy-${policy.id}`,
            type: "policy",
            title: "Póliza actualizada",
            description: `${policy.policy_type} - ${policy.policy_number || "S/N"}`,
            date: policy.updated_at,
            entity_id: policy.id,
            entity_name: clientName
          });
        });
      }
    }
    if (typeFilters.length === 0 || typeFilters.includes("followup")) {
      let followupQuery = locals.supabase.from("policy_followups").select(`
          id,
          followup_type,
          description,
          date,
          created_at,
          updated_at,
          policies:policy_id (
            policy_number,
            policy_type,
            clients:client_id (
              first_name,
              last_name
            )
          )
        `).order("updated_at", { ascending: sortOrder === "asc" });
      if (dateFrom) {
        followupQuery = followupQuery.gte("updated_at", dateFrom);
      }
      if (dateTo) {
        followupQuery = followupQuery.lte("updated_at", dateTo);
      }
      const { data: followups } = await followupQuery;
      if (followups) {
        followups.forEach((followup) => {
          const policy = followup.policies;
          const client = policy?.clients;
          const clientName = client ? `${client.first_name} ${client.last_name}` : "Cliente desconocido";
          activities.push({
            id: `followup-${followup.id}`,
            type: "followup",
            title: `Seguimiento: ${followup.followup_type}`,
            description: followup.description || "Sin descripción",
            date: followup.updated_at,
            entity_id: followup.id,
            entity_name: clientName
          });
        });
      }
    }
    activities.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    const total = activities.length;
    const paginatedActivities = activities.slice(offset, offset + limit);
    return json({
      activities: paginatedActivities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return json({ error: "Error al cargar actividades" }, { status: 500 });
  }
};
export {
  GET
};
