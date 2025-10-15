import { z } from "zod";
const clientSchema = z.object({
  first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  document_number: z.string().optional().or(z.literal("")),
  birth_date: z.string().optional().or(z.literal("")),
  email_primary: z.string().email("Email inválido").optional().or(z.literal("")),
  email_secondary: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  phone_landline: z.string().optional().or(z.literal("")),
  street: z.string().optional().or(z.literal("")),
  street_number: z.string().optional().or(z.literal("")),
  floor: z.string().optional().or(z.literal("")),
  apartment: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  province: z.string().optional().or(z.literal("")),
  postal_code: z.string().optional().or(z.literal("")),
  alias_pas: z.string().optional().or(z.literal("")),
  referred_by: z.string().optional().or(z.literal("")),
  observations: z.string().optional().or(z.literal(""))
});
const updateClientSchema = clientSchema.partial();
export {
  clientSchema as c,
  updateClientSchema as u
};
