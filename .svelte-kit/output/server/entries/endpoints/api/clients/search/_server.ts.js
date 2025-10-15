import { json } from "@sveltejs/kit";
const GET = async ({ url, locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return json({ message: "No autenticado" }, { status: 401 });
  }
  try {
    const { data: userData, error: userError } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
    if (userError || !userData) {
      return json({ message: "Usuario no encontrado" }, { status: 404 });
    }
    const company_id = userData.company_id;
    const q = url.searchParams.get("q") || "";
    const limit = parseInt(url.searchParams.get("limit") || "20");
    let query = supabase.from("clients").select("id, first_name, last_name, email_primary, document_number").eq("company_id", company_id).eq("active", true).limit(limit);
    if (q) {
      query = query.or(
        `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email_primary.ilike.%${q}%,document_number.ilike.%${q}%`
      );
    }
    query = query.order("first_name", { ascending: true });
    const { data: clients, error } = await query;
    if (error) {
      return json({ message: error.message }, { status: 400 });
    }
    const options = (clients || []).map((client) => ({
      value: client.id,
      label: `${client.first_name} ${client.last_name}`,
      email: client.email_primary,
      document: client.document_number
    }));
    return json({ options });
  } catch (err) {
    console.error("Error searching clients:", err);
    return json({ message: "Error al buscar clientes" }, { status: 500 });
  }
};
export {
  GET
};
