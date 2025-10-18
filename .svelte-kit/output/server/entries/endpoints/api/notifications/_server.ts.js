import { json } from "@sveltejs/kit";
const GET = async ({ locals, url }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const { data: userData } = await supabase.from("users").select("company_id, alert_days_before_expiry").eq("id", session.user.id).single();
    if (!userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const companyId = userData.company_id;
    const alertDays = userData.alert_days_before_expiry || 30;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + alertDays);
    const { data: followupAlerts, error: followupError } = await supabase.from("policy_followups").select(`
				id,
				followup_type,
				date,
				description,
				alert_date,
				policy_id,
				policy:policies!inner(
					id,
					policy_number,
					policy_type,
					client_id,
					client:clients!inner(
						id,
						first_name,
						last_name
					)
				)
			`).eq("policy.company_id", companyId).not("alert_date", "is", null).gte("alert_date", today.toISOString().split("T")[0]).lte("alert_date", futureDate.toISOString().split("T")[0]).order("alert_date", { ascending: true });
    if (followupError) {
      console.error("Error fetching followup alerts:", followupError);
    }
    const { data: policyAlerts, error: policyError } = await supabase.from("policies").select(`
				id,
				policy_number,
				policy_type,
				expiry_date,
				review_date,
				client:clients!inner(
					id,
					first_name,
					last_name
				)
			`).eq("company_id", companyId).eq("active", true).gte("expiry_date", today.toISOString().split("T")[0]).lte("expiry_date", futureDate.toISOString().split("T")[0]).order("expiry_date", { ascending: true });
    if (policyError) {
      console.error("Error fetching policy alerts:", policyError);
    }
    const followupNotifications = (followupAlerts || []).map((alert) => ({
      id: `followup-${alert.id}`,
      type: "followup_alert",
      date: alert.alert_date,
      title: `Alerta de Seguimiento: ${alert.followup_type}`,
      description: alert.description || "Sin descripción",
      policy: {
        id: alert.policy.id,
        policy_number: alert.policy.policy_number,
        policy_type: alert.policy.policy_type
      },
      client: {
        id: alert.policy.client.id,
        name: `${alert.policy.client.first_name} ${alert.policy.client.last_name}`
      },
      followup: {
        id: alert.id,
        type: alert.followup_type,
        date: alert.date
      }
    }));
    const policyNotifications = (policyAlerts || []).map((policy) => {
      const expiryDate = new Date(policy.expiry_date);
      const daysUntilExpiry = Math.floor(
        (expiryDate.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24)
      );
      return {
        id: `policy-${policy.id}`,
        type: "policy_expiration",
        date: policy.expiry_date,
        title: `Póliza por vencer en ${daysUntilExpiry} ${daysUntilExpiry === 1 ? "día" : "días"}`,
        description: `${policy.policy_type} - ${policy.policy_number || "Sin número"}`,
        policy: {
          id: policy.id,
          policy_number: policy.policy_number,
          policy_type: policy.policy_type
        },
        client: {
          id: policy.client.id,
          name: `${policy.client.first_name} ${policy.client.last_name}`
        },
        daysUntilExpiry
      };
    });
    const allNotifications = [...followupNotifications, ...policyNotifications].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return json({
      notifications: allNotifications,
      count: allNotifications.length
    });
  } catch (err) {
    console.error("Error in GET /api/notifications:", err);
    return json({ message: "Error al obtener notificaciones" }, { status: 500 });
  }
};
export {
  GET
};
