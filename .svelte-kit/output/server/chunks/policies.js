import { z } from "zod";
const policySchema = z.object({
  client_id: z.string().uuid("ID de cliente inválido"),
  policy_number: z.string().min(3, "El número de póliza debe tener al menos 3 caracteres"),
  policy_type: z.enum(["auto", "home", "life", "health", "business", "other"]),
  insurance_company: z.string().min(2, "El nombre de la aseguradora es requerido"),
  premium_amount: z.number().positive("El monto debe ser positivo"),
  coverage_amount: z.number().positive("La cobertura debe ser positiva"),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  status: z.enum(["active", "expired", "cancelled", "pending"]).default("active"),
  notes: z.string().optional()
});
const updatePolicySchema = policySchema.partial().omit({ client_id: true });
const policyFilterSchema = z.object({
  client_id: z.string().uuid().optional(),
  status: z.enum(["active", "inactive", "expiring_soon", "expired", "cancelled", "pending"]).optional(),
  // Support single value or array of values
  policy_type: z.union([
    z.enum(["auto", "home", "life", "health", "business", "other"]),
    z.array(z.enum(["auto", "home", "life", "health", "business", "other"]))
  ]).optional(),
  payment_mode: z.array(z.enum(["monthly", "quarterly", "semi-annual", "annual"])).optional(),
  insurer: z.array(z.string()).optional(),
  search: z.string().optional(),
  active_only: z.boolean().default(false),
  sortBy: z.enum(["created_at", "expiry_date", "policy_number", "policy_type"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(30)
});
export {
  policySchema as a,
  policyFilterSchema as p,
  updatePolicySchema as u
};
