import { json } from "@sveltejs/kit";
const GET = async ({ locals }) => {
  const supabase = locals.supabase;
  const session = locals.session;
  if (!session?.user) {
    return new Response("No autenticado", { status: 401 });
  }
  try {
    const { data: allPolicies, error: allError } = await supabase.from("policies").select("payment_mode, policy_type, client_id").limit(100);
    const uniquePaymentModes = [...new Set(allPolicies?.map((p) => p.payment_mode).filter(Boolean))];
    const uniquePolicyTypes = [...new Set(allPolicies?.map((p) => p.policy_type).filter(Boolean))];
    const { data: userData } = await supabase.from("users").select("company_id").eq("id", session.user.id).single();
    const testPolicy = {
      client_id: allPolicies?.[0]?.client_id || "00000000-0000-0000-0000-000000000000",
      company_id: userData?.company_id,
      created_by: session.user.id,
      policy_number: "TEST-SEMI-ANNUAL",
      policy_type: "auto",
      payment_mode: "semi-annual",
      start_date: "2025-01-01",
      expiry_date: "2026-01-01",
      active: false
    };
    const { data: insertTest, error: insertError } = await supabase.from("policies").insert(testPolicy).select().single();
    if (insertTest) {
      await supabase.from("policies").delete().eq("id", insertTest.id);
    }
    return json({
      uniquePaymentModes,
      uniquePolicyTypes,
      semiAnnualTest: {
        success: !insertError,
        error: insertError?.message || null,
        errorDetails: insertError || null
      },
      samplePolicies: allPolicies?.slice(0, 5)
    });
  } catch (err) {
    return json({
      message: "Error querying database structure",
      error: err.message,
      details: err
    }, { status: 500 });
  }
};
export {
  GET
};
