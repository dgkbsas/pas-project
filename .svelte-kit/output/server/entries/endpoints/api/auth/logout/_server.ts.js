import { json } from "@sveltejs/kit";
const POST = async ({ locals }) => {
  try {
    console.log("[LOGOUT API] Iniciando logout...");
    const { error } = await locals.supabase.auth.signOut();
    if (error) {
      console.error("[LOGOUT API] Error al cerrar sesión:", error);
      return json(
        {
          success: false,
          message: error.message || "Error al cerrar sesión"
        },
        { status: 500 }
      );
    }
    console.log("[LOGOUT API] Logout exitoso");
    return json({
      success: true,
      message: "Sesión cerrada exitosamente"
    });
  } catch (error) {
    console.error("[LOGOUT API] Error inesperado:", error);
    return json(
      {
        success: false,
        message: "Error inesperado al cerrar sesión"
      },
      { status: 500 }
    );
  }
};
export {
  POST
};
