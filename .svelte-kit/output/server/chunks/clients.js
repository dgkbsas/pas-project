import { z } from "zod";
const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  tax_id: z.string().optional(),
  notes: z.string().optional()
});
const updateClientSchema = clientSchema.partial();
export {
  clientSchema as c,
  updateClientSchema as u
};
