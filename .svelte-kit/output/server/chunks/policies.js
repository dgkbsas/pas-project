import { z } from "zod";
const basePolicySchema = z.object({
  client_id: z.string().uuid("ID de cliente inválido"),
  policy_number: z.string().min(1, "El número de póliza es requerido").optional().nullable(),
  policy_type: z.string().min(1, "El tipo de póliza es requerido"),
  insurer_id: z.string().uuid("ID de aseguradora inválido").optional().nullable(),
  payment_mode: z.string().optional().nullable(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  review_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)").optional().nullable(),
  vehicle_plate: z.string().max(20, "El dominio es muy largo").optional().nullable(),
  vehicle_brand: z.string().max(100).optional().nullable(),
  vehicle_model: z.string().max(100).optional().nullable(),
  insured_sum: z.number().nonnegative("La suma asegurada debe ser positiva").optional().nullable(),
  accessories: z.string().max(2e3, "Los accesorios son muy largos").optional().nullable(),
  premium: z.number().nonnegative("El premio debe ser positivo").optional().nullable(),
  endorsement: z.string().max(2e3, "El endoso es muy largo").optional().nullable(),
  observations: z.string().max(1e3, "Las observaciones son muy largas").optional().nullable(),
  active: z.boolean().default(true),
  created_by: z.string().uuid().optional()
});
const policySchema = basePolicySchema.refine(
  (data) => {
    if (data.start_date && data.expiry_date) {
      return new Date(data.expiry_date) > new Date(data.start_date);
    }
    return true;
  },
  {
    message: "La fecha de vencimiento debe ser posterior a la fecha de inicio",
    path: ["expiry_date"]
  }
);
const updatePolicySchema = basePolicySchema.omit({ client_id: true, created_by: true }).partial().refine(
  (data) => {
    if (data.start_date && data.expiry_date) {
      return new Date(data.expiry_date) > new Date(data.start_date);
    }
    return true;
  },
  {
    message: "La fecha de vencimiento debe ser posterior a la fecha de inicio",
    path: ["expiry_date"]
  }
);
const policyFilterSchema = z.object({
  client_id: z.string().uuid().optional(),
  status: z.enum(["active", "inactive", "expiring_soon", "expired", "cancelled", "pending"]).optional(),
  // Support single value or array of values - now accepts any string since they're configurable
  policy_type: z.union([
    z.string(),
    z.array(z.string())
  ]).optional(),
  payment_mode: z.array(z.string()).optional(),
  insurer: z.array(z.string()).optional(),
  search: z.string().optional(),
  active_only: z.boolean().default(false),
  sortBy: z.enum(["created_at", "expiry_date", "policy_number", "policy_type", "insurer", "payment_mode"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(30)
});
export {
  policySchema as a,
  policyFilterSchema as p,
  updatePolicySchema as u
};
